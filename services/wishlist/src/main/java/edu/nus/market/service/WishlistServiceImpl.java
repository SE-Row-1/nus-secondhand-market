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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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

        if (itemSeller.isPresent() && userId == itemSeller.get().getSeller().getSellerId()) {
            itemLikeInfoResponse = new ResItemLikeInfo(count, favoriteDate, wishlistDao.findUserInfoByItemId(itemId));
        } else {
            itemLikeInfoResponse = new ResItemLikeInfo(count, favoriteDate, new ArrayList<>());
        }

        return ResponseEntity.status(HttpStatus.OK).body(itemLikeInfoResponse);
    }

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void updateItemService(Like updatedLikeInfo) {
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
        } else if (updatedLikeInfo instanceof PackLike) {
            PackLike packLike = (PackLike) updatedLikeInfo;
            update.set("discount", packLike.getDiscount());
        }
        //search original information before executing update
        List<Like> updatedLikes = wishlistDao.findByItemId(itemId);
        // Execute
        mongoTemplate.updateMulti(query, update, Like.class);




        for (Like updatedLike : updatedLikes) {
            EmailMessage message = new EmailMessage(updatedLike.getEmail(), "Your Wanted Product Updated!",
                "The " + updatedLike.getName() + " you wanted has been updated.");
            rabbitTemplate.convertAndSend("notification", "email", message);
        }
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
