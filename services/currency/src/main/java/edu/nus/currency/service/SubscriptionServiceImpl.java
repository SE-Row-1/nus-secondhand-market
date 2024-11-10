package edu.nus.currency.service;

import edu.nus.currency.pojo.ErrorMsg;
import edu.nus.currency.pojo.ErrorMsgEnum;
import edu.nus.currency.pojo.ReqEntity.UpdateSingleSubscriptionReq;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionServiceImpl implements SubscriptionService{

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    private static final String SUBSCRIPTION_KEY = "subscription";
    public ResponseEntity<Object> UpdateSingleSubscription(UpdateSingleSubscriptionReq req) {
        // check if old currency exists in req
        if (req.getOldCurrency() != null && !req.getOldCurrency().isEmpty()) {

            // check if old currency exists in Redis
            if (!redisTemplate.opsForHash().hasKey(SUBSCRIPTION_KEY, req.getOldCurrency())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_INPUT.ErrorMsg));
            }

            // check if old currency count is less than 0
            Integer oldCount = Integer.parseInt(redisTemplate.opsForHash().get(SUBSCRIPTION_KEY, req.getOldCurrency()).toString());
            if (oldCount == null || oldCount <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_INPUT.ErrorMsg));
            }

            // remove old subscription
            redisTemplate.opsForHash().increment(SUBSCRIPTION_KEY, req.getOldCurrency(), -1);

            // after removing, check if need to delete the currency key
            if (Integer.parseInt(redisTemplate.opsForHash().get(SUBSCRIPTION_KEY, req.getOldCurrency()).toString()) <= 0) {
                redisTemplate.opsForHash().delete(SUBSCRIPTION_KEY, req.getOldCurrency());
            }
        }

        // check if new currency exists in req
        if (req.getNewCurrency() != null && !req.getNewCurrency().isEmpty()) {
            // add new subscription
            redisTemplate.opsForHash().increment(SUBSCRIPTION_KEY, req.getNewCurrency(), 1);

        }

        // persist subscription data
        redisTemplate.persist(SUBSCRIPTION_KEY);

        return ResponseEntity.ok().build();
    }
}
