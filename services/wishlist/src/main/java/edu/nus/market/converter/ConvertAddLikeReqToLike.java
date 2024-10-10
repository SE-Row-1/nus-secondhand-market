package edu.nus.market.converter;

import edu.nus.market.pojo.AddLikeReq;
import edu.nus.market.pojo.Like;

import java.util.Date;

public class ConvertAddLikeReqToLike {
    public static Like convert(AddLikeReq req)
    {
        Like like = new Like();
        like.setId(null);
        like.setType(req.getType());

        like.setUserId(req.getUserId());
        like.setItemId(req.getItemId());

        like.setFavoriteDate(new Date());
        like.setItemName(req.getItemName());
        like.setItemStatus(req.getItemStatus());

        like.setPrice(req.getPrice());
        like.setPhotoURL(req.getPhotoURL());

        return like;
    }


}
