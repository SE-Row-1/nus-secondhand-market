package edu.nus.market.service;

import edu.nus.market.pojo.Like;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import org.springframework.http.ResponseEntity;

import java.util.Date;

public interface WishlistService {
    ResponseEntity<Object> getWishlistService(int userId, Date before);

    ResponseEntity<Object> addLikeService(AddLikeReq addLikeReq);

    ResponseEntity<Object> deleteLikeService(int userId, String itemId);

    ResponseEntity<Object> getItemLikeInfoService(String itemId, int userId);

    void updateItemService(Like updatedLike);

    void deleteItemService(String itemId);

    void deleteAccountService(int userId);
}
