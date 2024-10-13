package edu.nus.market.service;

import edu.nus.market.pojo.AddLikeReq;
import org.springframework.http.ResponseEntity;

public interface WishlistService {
    ResponseEntity<Object> getWishlistService(int i);

    ResponseEntity<Object> addLikeService(AddLikeReq addLikeReq);

}
