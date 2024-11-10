package edu.nus.market.service;

import edu.nus.market.converter.ConvertDateToISO;
import edu.nus.market.dao.WishlistDao;
import edu.nus.market.pojo.*;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import edu.nus.market.converter.ConvertAddLikeReqToLike;
import edu.nus.market.pojo.ResEntity.EmailMessage;
import edu.nus.market.pojo.ResEntity.ResItemLikeInfo;
import edu.nus.market.pojo.ResEntity.ResWishlist;
import jakarta.annotation.Resource;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Resource
    private WishlistDao wishlistDao;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private static final Logger logger = LoggerFactory.getLogger(WishlistServiceImpl.class);

    @Override
    public ResponseEntity<Object> getWishlistService(int id, Date before) {
        try {
            List<Like> likes = wishlistDao.findTop10ByUserIdAndWantedAtBeforeOrderByWantedAtDesc(id, before);
            String nextCursor = likes.isEmpty() ? null : ConvertDateToISO.convert(likes.get(likes.size() - 1).getWantedAt());

            ResWishlist response = new ResWishlist(nextCursor, likes);
            logger.info("Returning wishlist with nextCursor: {} and items: {}", nextCursor, likes);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            logger.error("Error in getWishlistService for userId: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving wishlist.");
        }
    }

    @Override
    public ResponseEntity<Object> addLikeService(AddLikeReq req) {
        try {
            Optional<Like> existingLike = wishlistDao.findByUserIdAndItemId(req.getUserId(), req.getItemId());
            if (existingLike.isPresent()) {
                logger.warn("Conflict: Item already exists in wishlist for userId: {}, itemId: {}", req.getUserId(), req.getItemId());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.WISHLIST_CONFLICT.ErrorMsg));
            }
            wishlistDao.save(ConvertAddLikeReqToLike.convert(req));
            logger.info("Added new like for userId: {}, itemId: {}", req.getUserId(), req.getItemId());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            logger.error("Error in addLikeService for userId: {}", req.getUserId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding like.");
        }
    }

    @Override
    public ResponseEntity<Object> deleteLikeService(int userId, String itemId) {
        try {
            Optional<Like> existingLike = wishlistDao.findByUserIdAndItemId(userId, itemId);
            if (!existingLike.isPresent()) {
                logger.warn("Item not found in wishlist for deletion, userId: {}, itemId: {}", userId, itemId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.LIKE_NOT_FOUND.ErrorMsg));
            }
            wishlistDao.delete(existingLike.get());
            logger.info("Deleted like for userId: {}, itemId: {}", userId, itemId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            logger.error("Error in deleteLikeService for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting like.");
        }
    }

    @Override
    public ResponseEntity<Object> getItemLikeInfoService(String itemId, int userId) {
        try {
            int count = wishlistDao.countByItemId(itemId);
            Date favoriteDate = wishlistDao.findTopWantedAtByItemId(itemId);
            ResItemLikeInfo itemLikeInfoResponse;
            Optional<Like> itemSeller = wishlistDao.findFirstByItemId(itemId);

            if (itemSeller.isPresent() && userId == itemSeller.get().getSeller().getSellerId()) {
                itemLikeInfoResponse = new ResItemLikeInfo(count, favoriteDate, wishlistDao.findUserInfoByItemId(itemId));
                logger.info("User is the seller. Returning full like info for itemId: {}", itemId);
            } else {
                itemLikeInfoResponse = new ResItemLikeInfo(count, favoriteDate, new ArrayList<>());
                logger.info("User is not the seller. Returning restricted like info for itemId: {}", itemId);
            }

            return ResponseEntity.status(HttpStatus.OK).body(itemLikeInfoResponse);
        } catch (Exception e) {
            logger.error("Error in getItemLikeInfoService for itemId: {}, userId: {}", itemId, userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving item like info.");
        }
    }

    public void updateItemService(Like updatedLikeInfo) {
        try {
            boolean hasImage = false;
            String imageUrl = null;
            String itemId = updatedLikeInfo.getItemId();

            Query query = new Query(Criteria.where("itemId").is(itemId));
            Update update = new Update();
            update.set("name", updatedLikeInfo.getName());
            update.set("price", updatedLikeInfo.getPrice());
            update.set("status", updatedLikeInfo.getStatus());
            update.set("seller", updatedLikeInfo.getSeller());

            if (updatedLikeInfo instanceof SingleLike) {
                SingleLike singleLike = (SingleLike) updatedLikeInfo;
                update.set("photoUrls", singleLike.getPhotoUrls());
                imageUrl = singleLike.getPhotoUrls().get(0);
                hasImage = true;
            } else if (updatedLikeInfo instanceof PackLike) {
                PackLike packLike = (PackLike) updatedLikeInfo;
                update.set("discount", packLike.getDiscount());
            }

            List<Like> updatedLikes = wishlistDao.findByItemId(itemId);
            mongoTemplate.updateMulti(query, update, Like.class);

            boolean changePrice = false;
            String title = "Your Wanted Product Updated!";
            if (!updatedLikes.isEmpty()) {
                changePrice = updatedLikeInfo.getPrice() != updatedLikes.get(0).getPrice();
                title = changePrice ? "Price Of Your Wanted Product Updated!" : "Your Wanted Product Updated!";
            } else {
                logger.warn("No likes found for itemId: {} when updating item", itemId);
            }
            List<Map<String, String>> emailBatch = new ArrayList<>();

            for (Like updatedLike : updatedLikes) {
                String emailContent = generateEmailContent(title, updatedLike, updatedLikeInfo, imageUrl, changePrice, hasImage);
                Map<String, String> emailData = new HashMap<>();
                emailData.put("to", updatedLike.getEmail());
                emailData.put("title", title);
                emailData.put("content", emailContent);
                emailBatch.add(emailData);
            }

            Map<String, Object> batchEmailRequest = new HashMap<>();
            batchEmailRequest.put("emails", emailBatch);
            rabbitTemplate.convertAndSend("notification", "batch-email", batchEmailRequest);

            logger.info("Updated item service for itemId: {}. Batch email notification sent.", itemId);
        } catch (Exception e) {
            logger.error("Error in updateItemService for itemId: {}", updatedLikeInfo.getItemId(), e);
        }
    }

    private String generateEmailContent(String title, Like oldLikeDataWithPersonalInfo, Like newLikeData, String imageUrl, boolean changePrice, boolean hasImage) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body>")
            .append("<h2>").append(title).append("</h2>")
            .append("<p>Hi, ").append(oldLikeDataWithPersonalInfo.getNickname()).append(". The <strong>").append(oldLikeDataWithPersonalInfo.getName());
        if (changePrice) {
            content.append("</strong>'s price has been updated to <strong>").append(newLikeData.getPrice()).append("SGD</strong>, ");
        } else {
            content.append("</strong> has been updated, ");
        }

        content.append("come and check it!</p>")
            .append("<p>Click <a href='https://www.nshm.store/items/").append(oldLikeDataWithPersonalInfo.getItemId()).append("'>here</a> to view the product.</p>");

        if (hasImage) {
            content.append("<p><img src='").append(imageUrl).append("' alt='Product Image' /></p>");
        }

        content.append("</body></html>");
        return content.toString();
    }

    @Override
    public void deleteItemService(String itemId) {
        try {
            wishlistDao.deleteByItemId(itemId);
            logger.info("Deleted item with itemId: {}", itemId);
        } catch (Exception e) {
            logger.error("Error in deleteItemService for itemId: {}", itemId, e);
        }
    }

    @Override
    public void deleteAccountService(int userId) {
        try {
            wishlistDao.deleteAllByUserId(userId);
            wishlistDao.deleteBySellerId(userId);
            logger.info("Deleted all wishlist entries for userId: {}", userId);
        } catch (Exception e) {
            logger.error("Error in deleteAccountService for userId: {}", userId, e);
        }
    }

    @Override
    public ResponseEntity<Object> checkLikeService(String itemId, int userId) {
        try {
            Optional<Like> existingLike = wishlistDao.findByUserIdAndItemId(userId, itemId);
            if (existingLike.isPresent()) {
                logger.info("Item found in wishlist for userId: {}, itemId: {}", userId, itemId);
                return ResponseEntity.status(HttpStatus.OK).body(existingLike);
            } else {
                logger.warn("Item not found in wishlist for userId: {}, itemId: {}", userId, itemId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.LIKE_NOT_FOUND.ErrorMsg));
            }
        } catch (Exception e) {
            logger.error("Error in checkLikeService for userId: {}, itemId: {}", userId, itemId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking like.");
        }
    }
}
