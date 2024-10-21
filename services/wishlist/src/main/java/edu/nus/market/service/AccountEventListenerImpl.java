package edu.nus.market.service;

import edu.nus.market.pojo.ResEntity.ResAccount;
import jakarta.annotation.Resource;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class AccountEventListenerImpl implements AccountEventListener{
    @Resource
    WishlistService wishlistService;

    @Override
    @RabbitListener(queues = "account.deleted")
    public void handleAccountDeleted(String userId) {
        System.out.println("Received delete message: " + userId);
        wishlistService.deleteAccountService(Integer.parseInt(userId));
    }
}
