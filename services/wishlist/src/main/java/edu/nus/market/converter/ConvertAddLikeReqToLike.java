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

        if ("PACK".equalsIgnoreCase(req.getType())) {
            // Convert to PackLike
            PackLike packLike = new PackLike();
            setCommonPara(req, packLike);
            packLike.setDiscount(req.getDiscount());  // Set discount for PackLike

            // Convert each child to SingleLike
            packLike.setChildren(
                req.getChildren().stream()
                    .map(ConvertAddLikeReqToLike::convert)
                    .map(SingleLike.class::cast)
                    .collect(Collectors.toList())
            );

            like = packLike;
        } else {
            // Convert to SingleLike
            SingleLike singleLike = new SingleLike();
            setCommonPara(req, singleLike);
            singleLike.setPhotoUrls(req.getPhotoUrls());  // Specific to SingleLike
            like = singleLike;
        }

        return like;
    }

    private static void setCommonPara(AddLikeReq req, Like like) {
        // Set common fields for both SingleLike and PackLike
        like.setId(null);  // MongoDB will generate the ID
        like.setType(req.getType());
        like.setUserId(req.getUserId());
        like.setItemId(req.getItemId());
        like.setFavoriteDate(new Date());  // Set current date
        like.setItemName(req.getItemName());
        like.setItemStatus(req.getItemStatus());
        like.setPrice(req.getPrice());
        like.setSeller(req.getSeller());  // Set seller info
    }
}
