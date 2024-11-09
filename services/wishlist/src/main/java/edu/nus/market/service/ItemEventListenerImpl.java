package edu.nus.market.service;

import edu.nus.market.converter.ConvertAddLikeReqToLike;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ItemEventListenerImpl implements ItemEventListener {

    @Resource
    WishlistService wishlistService;

    private static final Logger logger = LoggerFactory.getLogger(ItemEventListenerImpl.class);

    @PostConstruct
    public void init() {
        logger.info("Initializing ItemEventListenerImpl - Checking connection to RabbitMQ queues");
    }

    // 监听 item.updated 队列，处理更新的商品
    @Override
    @RabbitListener(queues = "item.updated")
    public void handleItemUpdated(AddLikeReq updatedLikeReq) {
        try {
            logger.info("Received item.updated message: {}", updatedLikeReq.getItemId());
            wishlistService.updateItemService(ConvertAddLikeReqToLike.convert(updatedLikeReq));
        } catch (Exception e) {
            logger.error("Error processing item.updated message: {}", updatedLikeReq.getItemId(), e);
        }
    }

    // 监听 item.deleted 队列，处理被删除的商品
    @Override
    @RabbitListener(queues = "item.deleted")
    public void handleItemDeleted(String itemId) {
        try {
            logger.info("Received item.deleted message: {}", itemId);
            wishlistService.deleteItemService(itemId);
        } catch (Exception e) {
            logger.error("Error processing item.deleted message: {}", itemId, e);
        }
    }
}
