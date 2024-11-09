package edu.nus.currency.controller;

import edu.nus.currency.pojo.ErrorMsg;
import edu.nus.currency.pojo.ErrorMsgEnum;
import edu.nus.currency.pojo.ResEntity.JWTPayload;
import edu.nus.currency.pojo.ReqEntity.UpdExgRatReq;
import edu.nus.currency.pojo.UpdateCurrencyMessage;
import edu.nus.currency.security.JwtTokenManager;
import edu.nus.currency.service.CurrencyService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/exchange")
public class CurrencyController {
    @Resource
    CurrencyService currencyService;

    private final RedisTemplate<String, Object> redisTemplate;

    public CurrencyController(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PutMapping ("")
    public ResponseEntity<Object> updateCurrencies(@Valid @RequestBody UpdExgRatReq updExgRatReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return currencyService.updateCurrenciesService(updExgRatReq);
    }

    @GetMapping ("")
    public ResponseEntity<Object> getPreferredCurrency(@CookieValue(value = "access_token", required = false) String token){
        JWTPayload decodedToken = JwtTokenManager.decodeAccessToken(token);
        String preferredCurrency = decodedToken.getPreferredCurrency();
        return currencyService.getPreferredCurrencyService(preferredCurrency);
    }

    @PostMapping ("")
    public ResponseEntity<Object> addSubscription(@RequestBody UpdateCurrencyMessage updateCurrencyMessage){
        String key = "subscription";

        // deal with old currency
        // if old currency exists in requirement
        if (updateCurrencyMessage.getOldCurrency() != null && updateCurrencyMessage.getOldCurrency() != ""){

            // check if old currency exists in redis (check key)
            if (redisTemplate.opsForHash().hasKey(key, updateCurrencyMessage.getOldCurrency()) == false)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_INPUT.ErrorMsg));

            // check if old currency count is greater than 0 (check value)
            Integer oldCount = Integer.parseInt(redisTemplate.opsForHash().get(key, updateCurrencyMessage.getOldCurrency()).toString());
            if (oldCount == null || oldCount <= 0)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_INPUT.ErrorMsg));

            redisTemplate.opsForHash().increment(key, updateCurrencyMessage.getOldCurrency(), -1);

            // if old currency count is 0, delete it
            if (Integer.parseInt(redisTemplate.opsForHash().get(key, updateCurrencyMessage.getOldCurrency()).toString()) <= 0){
                redisTemplate.opsForHash().delete(key, updateCurrencyMessage.getOldCurrency());
            }
        }

        // deal with new currency (add subscription)
        redisTemplate.opsForHash().increment(key, updateCurrencyMessage.getNewCurrency(), 1); // Increment the subscriber count by 1.increment(key, 1); // Track how many times a user subscribed


        redisTemplate.persist(key); // Persist the subscription hash to disk

        return ResponseEntity.ok().build();
    }
}
