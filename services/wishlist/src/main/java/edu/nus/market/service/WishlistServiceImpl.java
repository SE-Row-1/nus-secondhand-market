package edu.nus.market.service;

import edu.nus.market.converter.ConvertDateToISO;
import edu.nus.market.dao.WishlistDao;
import edu.nus.market.pojo.Item;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.Like;
import edu.nus.market.converter.ConvertAddLikeReqToLike;

import edu.nus.market.pojo.ResEntity.ResItemLikeInfo;
import edu.nus.market.pojo.ResEntity.ResLike;
import jakarta.annotation.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

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

        ResLike response = new ResLike(nextCursor, likes);

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
    public ResponseEntity<Object> getItemLikeInfo(String itemId, int userId) {
        int count = wishlistDao.countByItemId(itemId);
        Date favoriteDate = wishlistDao.findTopWantedAtByItemId(itemId);


        ResItemLikeInfo response = new ResItemLikeInfo(count, favoriteDate);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Override
    public void updateItem(Item updatedItem) {

    }

    @Override
    public void deleteItemService(String itemId) {

    }

    @Override
    public void deleteAccountService(int userId) {
        wishlistDao.deleteAllByUserId(userId);
    }
}
