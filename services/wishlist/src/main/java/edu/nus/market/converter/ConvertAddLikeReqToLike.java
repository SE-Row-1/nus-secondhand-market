package edu.nus.market.converter;

import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import edu.nus.market.pojo.SingleLike;
import edu.nus.market.pojo.PackLike;
import edu.nus.market.pojo.Like;

import java.util.Date;
import java.util.stream.Collectors;

public class ConvertAddLikeReqToLike {

    // Convert AddLikeReq to SingleLike or PackLike based on the type
    public static Like convert(AddLikeReq req) {
        Like like;

        if ("pack".equals(req.getType())) {
            // Convert to PackLike
            PackLike packLike = new PackLike();
            setCommonPara(req, packLike);
            packLike.setDiscount(req.getDiscount());
            like = packLike;
        } else if ("single".equals(req.getType())) {
            // Convert to SingleLike
            SingleLike singleLike = new SingleLike();
            setCommonPara(req, singleLike);
            singleLike.setPhotoUrls(req.getPhotoUrls());
            like = singleLike;
        } else {
            throw new IllegalArgumentException("Invalid type: " + req.getType());
        }

        return like;
    }

    private static void setCommonPara(AddLikeReq req, Like like) {
        // Set common fields for both SingleLike and PackLike
        like.setId(null);  // MongoDB will generate the ID
        like.setType(req.getType());
        like.setUserId(req.getUserId());
        like.setNickname(req.getNickname());
        like.setAvatarUrl(req.getAvatarUrl());
        like.setItemId(req.getItemId());
        like.setWantedAt(new Date());  // Set current date
        like.setName(req.getName());
        like.setStatus(req.getStatus());
        like.setPrice(req.getPrice());
        like.setSeller(req.getSeller());  // Set seller info
    }
}
