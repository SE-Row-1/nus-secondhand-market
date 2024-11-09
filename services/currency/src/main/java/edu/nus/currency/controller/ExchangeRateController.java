package edu.nus.currency.controller;

import edu.nus.currency.pojo.ErrorMsg;
import edu.nus.currency.pojo.ErrorMsgEnum;
import edu.nus.currency.pojo.UpdExgRatReq;
import edu.nus.currency.pojo.UpdateCurrencyMessage;
import edu.nus.currency.service.CurrencyServiceImpl;
import edu.nus.currency.service.ExchangeRateService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exchange")
public class ExchangeRateController {
    @Resource
    ExchangeRateService exchangeRateService;

    private final RedisTemplate<String, Object> redisTemplate;

    public ExchangeRateController(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @GetMapping ("")
    public ResponseEntity<Object> updateExchangeRate(@Valid @RequestBody UpdExgRatReq updExgRatReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return exchangeRateService.updateExchangeRate(updExgRatReq);
    }

    @PostMapping ("")
    public ResponseEntity<Object> addSubscription(@RequestBody UpdateCurrencyMessage updateCurrencyMessage){
        String key = "subscription";
        redisTemplate.opsForHash().increment(key, updateCurrencyMessage.getNewCurrency(), 1); // Increment the subscriber count by 1.increment(key, 1); // Track how many times a user subscribed
        if (updateCurrencyMessage.getOldCurrency() != null && updateCurrencyMessage.getOldCurrency() != ""){
            redisTemplate.opsForHash().increment(key, updateCurrencyMessage.getOldCurrency(), -1);
            if (Integer.parseInt(redisTemplate.opsForHash().get(key, updateCurrencyMessage.getOldCurrency()).toString()) == 0){
                redisTemplate.opsForHash().delete(key, updateCurrencyMessage.getOldCurrency());
            }
        }

        redisTemplate.persist(key); // Persist the subscription hash to disk

        return ResponseEntity.ok().build();
    }

}
