package edu.nus.currency.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class CurrencyServiceImpl implements CurrencyService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static Logger logger = LoggerFactory.getLogger(CurrencyServiceImpl.class);

    public CurrencyServiceImpl(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

//    @RabbitListener(queues = "currency")
    // Method to update subscription data and persist it
    public void addSubscription(String currency) {

//        logger.info("Received currency message: " + currency);
//
//        String key = "subscription";
//        redisTemplate.opsForHash().increment(key, currency, 1); // Increment the subscriber count by 1.increment(key, 1); // Track how many times a user subscribed
//        redisTemplate.persist(key); // Persist the subscription hash to disk
    }

    // Schedule persistence for subscription table every min
    @Scheduled(cron = "0 * * * * ?")
    public void persistSubscriptionData() {
//        String pattern = "subscription";
//        redisTemplate.keys(pattern).forEach(redisTemplate::persist);
    }
}

