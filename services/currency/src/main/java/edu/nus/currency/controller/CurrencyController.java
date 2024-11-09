package edu.nus.currency.controller;

import edu.nus.currency.pojo.ErrorMsg;
import edu.nus.currency.pojo.ErrorMsgEnum;
import edu.nus.currency.pojo.ResEntity.JWTPayload;
import edu.nus.currency.pojo.ReqEntity.UpdExgRatReq;
import edu.nus.currency.pojo.UpdateCurrencyMessage;
import edu.nus.currency.security.JwtTokenManager;
import edu.nus.currency.service.ExchangeRateService;
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
    ExchangeRateService exchangeRateService;

    private final RedisTemplate<String, Object> redisTemplate;

    public CurrencyController(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PutMapping ("")
    public ResponseEntity<Object> updateCurrencies(@Valid @RequestBody UpdExgRatReq updExgRatReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return exchangeRateService.updateCurrenciesService(updExgRatReq);
    }

    @GetMapping ("")
    public ResponseEntity<Object> getPreferredCurrency(@CookieValue(value = "access_token", required = false) String token){
        JWTPayload decodedToken = JwtTokenManager.decodeAccessToken(token);
        String preferredCurrency = decodedToken.getPreferredCurrency();
        return exchangeRateService.getPreferredCurrencyService(preferredCurrency);
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
