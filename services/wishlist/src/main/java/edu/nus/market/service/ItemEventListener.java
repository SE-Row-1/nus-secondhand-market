package edu.nus.market.service;


import edu.nus.market.pojo.ReqEntity.AddLikeReq;

public interface ItemEventListener {
    void handleItemUpdated(AddLikeReq updatedLikeReq);
    void handleItemDeleted(String itemId);
}
