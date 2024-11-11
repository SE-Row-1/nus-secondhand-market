package edu.nus.market.service;

import edu.nus.market.pojo.CurrenciesList;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.UpdateSingleSubscriptionReq;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionServiceImpl implements SubscriptionService{

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    CurrencyService currencyService;

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionServiceImpl.class);

    private static final String SUBSCRIPTION_KEY = "subscription";
    private static final String SOURCE_CURRENCY = "SGD";
    public ResponseEntity<Object> UpdateSingleSubscriptionService(UpdateSingleSubscriptionReq req) {
        if (req.getNewCurrency() != null)
            if(CurrenciesList.isValidCurrency(req.getNewCurrency()))
                req.setNewCurrency(SOURCE_CURRENCY + req.getNewCurrency());
            else{
                logger.error("{}is not in Currency List", req.getNewCurrency());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_INPUT.ErrorMsg));
            }
        if (req.getOldCurrency() != null)
            if(CurrenciesList.isValidCurrency(req.getOldCurrency()))
                req.setNewCurrency(SOURCE_CURRENCY + req.getOldCurrency());
            else{
                logger.error("{}is not in Currency List", req.getOldCurrency());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_INPUT.ErrorMsg));
            }
        // check if old currency exists in req
        if (req.getOldCurrency() != null && !req.getOldCurrency().isEmpty()) {

            // check if old currency exists in Redis
            if (!redisTemplate.opsForHash().hasKey(SUBSCRIPTION_KEY, req.getOldCurrency())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.RECORD_NOT_FOUND.ErrorMsg));
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

        boolean needUpdate = false;
        // check if new currency exists in Redis
        if (!redisTemplate.opsForHash().hasKey(SUBSCRIPTION_KEY, req.getNewCurrency())) {
            needUpdate = true;
        }

        // check if new currency exists in req
        if (req.getNewCurrency() != null && !req.getNewCurrency().isEmpty()) {
            // add new subscription
            redisTemplate.opsForHash().increment(SUBSCRIPTION_KEY, req.getNewCurrency(), 1);

        }

        if (needUpdate) {
            currencyService.scheduleUpdateCurrencies();
        }

        // persist subscription data
        redisTemplate.persist(SUBSCRIPTION_KEY);

        return ResponseEntity.ok().build();
    }



    @PostConstruct
    public void init() {
        logger.info("Initializing ItemEventListenerImpl - Checking connection to RabbitMQ queues");
    }

    @Override
    @RabbitListener(queues = "currency.account.currencyDeleted")
    public void handleAccountCurrencyDeleted(UpdateSingleSubscriptionReq req) {
        try {
            logger.info("Received account.currencyDeleted message: {}", req);

            UpdateSingleSubscriptionService(req);
            logger.info("Successfully processed account.currencyDeleted for userId: {}", req);
        } catch (Exception e) {
            logger.error("Error processing account.currencyDeleted message for userId: {}", req, e);
        }
    }

}
