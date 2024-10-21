package edu.nus.market.service;

import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import org.springframework.http.ResponseEntity;

import java.util.Date;

public interface WishlistService {
    ResponseEntity<Object> getWishlistService(int userId, Date before);

    ResponseEntity<Object> addLikeService(AddLikeReq addLikeReq);

    ResponseEntity<Object> deleteLikeService(int userId, String itemId);

    ResponseEntity<Object> getItemLikeInfo(String itemId);

}
