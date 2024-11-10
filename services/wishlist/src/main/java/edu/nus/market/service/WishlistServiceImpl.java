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

import java.util.*;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Resource
    private WishlistDao wishlistDao;

    @Override
    public ResponseEntity<Object> getWishlistService(int id, Date before) {
        List<Like> likes = wishlistDao.findTop10ByUserIdAndWantedAtBeforeOrderByWantedAtDesc(id, before);
        // Find the nextBefore date
        String nextCursor = null;
        if (!likes.isEmpty()) {
            Date nextBefore = likes.get(likes.size() - 1).getWantedAt();
            nextCursor = ConvertDateToISO.convert(nextBefore);
        }

        ResWishlist response = new ResWishlist(nextCursor, likes);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public ResponseEntity<Object> addLikeService(AddLikeReq req) {
        Optional<Like> existingLike = wishlistDao.findByUserIdAndItemId(req.getUserId(), req.getItemId());
        // Check if the item is already in the wishlist
        if (existingLike.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.WISHLIST_CONFLICT.ErrorMsg));
        }
        wishlistDao.save(ConvertAddLikeReqToLike.convert(req));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Override
    public ResponseEntity<Object> deleteLikeService(int userId, String itemId) {
        Optional<Like> existingLike = wishlistDao.findByUserIdAndItemId(userId, itemId);
        // Check if the item is already in the wishlist
        if (!existingLike.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.LIKE_NOT_FOUND.ErrorMsg));
        }
        wishlistDao.delete(existingLike.get());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Override
    public ResponseEntity<Object> getItemLikeInfoService(String itemId, int userId) {
        int count = wishlistDao.countByItemId(itemId);
        Date favoriteDate = wishlistDao.findTopWantedAtByItemId(itemId);
        ResItemLikeInfo itemLikeInfoResponse = null;
        Optional<Like> itemSeller = wishlistDao.findFirstByItemId(itemId);

        System.out.println("Seller checking");
        if (itemSeller.isPresent()) {
            if (userId == itemSeller.get().getSeller().getSellerId()){
                System.out.println(userId);
                System.out.println(itemSeller.get().getSeller().getSellerId());
                System.out.println("seller confirm");
                itemLikeInfoResponse = new ResItemLikeInfo(count, favoriteDate, wishlistDao.findUserInfoByItemId(itemId));
            }else{
                System.out.println(userId);
                System.out.println(itemSeller.get().getSeller().getSellerId());
                System.out.println("not seller");
                itemLikeInfoResponse = new ResItemLikeInfo(count, favoriteDate, new ArrayList<>());
            }

        } else {
            System.out.println(userId);
            System.out.println("not seller, no record");
            itemLikeInfoResponse = new ResItemLikeInfo(count, favoriteDate, new ArrayList<>());
        }

        return ResponseEntity.status(HttpStatus.OK).body(itemLikeInfoResponse);
    }

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void updateItemService(Like updatedLikeInfo) {
        boolean hasImage = false;
        String imageUrl = null;

        String itemId = updatedLikeInfo.getItemId();

        // Search by itemId
        Query query = new Query(Criteria.where("itemId").is(itemId));

        // new Update
        Update update = new Update();

        // Public fields
        update.set("name", updatedLikeInfo.getName());
        update.set("price", updatedLikeInfo.getPrice());
        update.set("status", updatedLikeInfo.getStatus());
        update.set("seller", updatedLikeInfo.getSeller());

        // Update specific fields
        if (updatedLikeInfo instanceof SingleLike) {
            SingleLike singleLike = (SingleLike) updatedLikeInfo;
            update.set("photoUrls", singleLike.getPhotoUrls());

            imageUrl = singleLike.getPhotoUrls().get(0); // Use the first photoUrl
            hasImage = true;
        } else if (updatedLikeInfo instanceof PackLike) {
            PackLike packLike = (PackLike) updatedLikeInfo;
            update.set("discount", packLike.getDiscount());

            hasImage = false; // No image for PackLike
        }
        //search original information before executing update
        List<Like> updatedLikes = wishlistDao.findByItemId(itemId);
        // Execute
        mongoTemplate.updateMulti(query, update, Like.class);

        //compare price

        String title;
        boolean changePrice;
        if (updatedLikeInfo.getPrice() != updatedLikes.get(0).getPrice()) {
            title = "Price Of Your Wanted Product Updated!";
            changePrice= true;
        }else{
            title = "Your Wanted Product Updated!";
            changePrice= false;
        }

        // Prepare batch email request
        List<Map<String, String>> emailBatch = new ArrayList<>();
        for (Like updatedLike : updatedLikes) {
            String emailContent = generateEmailContent(
                title,
                updatedLike,
                updatedLikeInfo,
                imageUrl,
                changePrice,
                hasImage
            );

            // Build email data
            Map<String, String> emailData = new HashMap<>();
            emailData.put("to", updatedLike.getEmail());
            emailData.put("title", title);
            emailData.put("content", emailContent);

            // Add to batch
            emailBatch.add(emailData);
        }

        // Send batch email
        Map<String, Object> batchEmailRequest = new HashMap<>();
        batchEmailRequest.put("emails", emailBatch);

        rabbitTemplate.convertAndSend("notification", "batch-email", batchEmailRequest);
    }
    private String generateEmailContent(String title,Like oldLikeDataWithPersonalInfo,Like newLikeData, String imageUrl, boolean changePrice, boolean hasImage) {
        StringBuilder content = new StringBuilder();
        content.append("<html><body>")
            .append("<h2>").append(title).append("</h2>")
            .append("<p>Hi, ").append(oldLikeDataWithPersonalInfo.getNickname()).append(". The <strong>").append(oldLikeDataWithPersonalInfo.getName());
        if (changePrice) {
            content.append("</strong>'s price has been updated to <strong>").append(newLikeData.getPrice()).append("SGD").append("</strong>, ");
        }else{
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
        wishlistDao.deleteByItemId(itemId);
    }

    @Override
    public void deleteAccountService(int userId) {
        wishlistDao.deleteAllByUserId(userId);
        wishlistDao.deleteBySellerId(userId);
    }

    @Override
    public ResponseEntity<Object> checkLikeService(String itemId, int userId) {
        Optional<Like> existingLike = wishlistDao.findByUserIdAndItemId(userId, itemId);
        if (existingLike.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(existingLike);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.LIKE_NOT_FOUND.ErrorMsg));
    }
}
