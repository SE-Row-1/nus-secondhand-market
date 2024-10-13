package edu.nus.market.service;

import edu.nus.market.dao.WishlistDao;
import edu.nus.market.pojo.AddLikeReq;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.Like;
import edu.nus.market.converter.ConvertAddLikeReqToLike;

import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Resource
    private WishlistDao wishlistDao;


    @Override
    public ResponseEntity<Object> getWishlistService(int id) {
        List<Like> likes = wishlistDao.findByUserId(id);
        return ResponseEntity.status(HttpStatus.OK).body(likes);
    }

    @Override
    public ResponseEntity<Object> addLikeService(AddLikeReq req) {
        Optional<Like> existingLike = wishlistDao.findByUserIdAndItemId(req.getUserId(), req.getItemId());
        // Check if the item is already in the wishlist
        if (existingLike.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.WISHLIST_CONFLICT.ErrorMsg));
        }
        wishlistDao.save(ConvertAddLikeReqToLike.convert(req));
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
