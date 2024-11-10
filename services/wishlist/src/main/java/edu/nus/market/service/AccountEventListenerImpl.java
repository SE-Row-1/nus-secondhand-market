package edu.nus.market.service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AccountEventListenerImpl implements AccountEventListener {

    @Resource
    WishlistService wishlistService;

    private static final Logger logger = LoggerFactory.getLogger(AccountEventListenerImpl.class);

    @PostConstruct
    public void init() {
        logger.info("Initializing ItemEventListenerImpl - Checking connection to RabbitMQ queues");
    }

    @Override
    @RabbitListener(queues = "wishlist.account.deleted")
    public void handleAccountDeleted(String userId) {
        try {
            logger.info("Received account.deleted message: {}", userId);
            userId = userId.replace("\"", "");
            int parsedUserId = Integer.parseInt(userId);
            wishlistService.deleteAccountService(parsedUserId);
            logger.info("Successfully processed account.deleted for userId: {}", parsedUserId);
        } catch (NumberFormatException e) {
            logger.error("Error parsing userId from message: {}", userId, e);
        } catch (Exception e) {
            logger.error("Error processing account.deleted message for userId: {}", userId, e);
        }
    }


}
