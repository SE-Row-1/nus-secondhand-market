package edu.nus.market.service;

import edu.nus.market.dao.WishlistDao;
import edu.nus.market.pojo.AddLikeReq;
import edu.nus.market.pojo.Like;
import edu.nus.market.converter.ConvertAddLikeReqToLike;

import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public ResponseEntity<Object> addLikeService(AddLikeReq addLikeReq) {

        return ResponseEntity.status(HttpStatus.OK).body(wishlistDao.save(ConvertAddLikeReqToLike.convert(addLikeReq)));
    }
}
