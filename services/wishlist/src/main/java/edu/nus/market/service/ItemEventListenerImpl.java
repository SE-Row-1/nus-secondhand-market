package edu.nus.market.service;


import edu.nus.market.converter.ConvertAddLikeReqToLike;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import edu.nus.market.service.WishlistService;
import jakarta.annotation.Resource;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class ItemEventListenerImpl implements ItemEventListener {

    @Resource
    WishlistService wishlistService;

    // 监听item.updated队列，处理更新的商品
    @Override
    @RabbitListener(queues = "item.updated")
    public void handleItemUpdated(AddLikeReq updatedLikeReq) {
        System.out.println(updatedLikeReq);
        wishlistService.updateItemService(ConvertAddLikeReqToLike.convert(updatedLikeReq));
    }


    // 监听item.deleted队列，处理被删除的商品
    @Override
    @RabbitListener(queues = "item.deleted")
    public void handleItemDeleted(String itemId) {
        System.out.println(itemId);
        wishlistService.deleteItemService(itemId);
    }
}
