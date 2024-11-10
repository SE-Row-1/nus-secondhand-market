package edu.nus.currency.controller;

import edu.nus.currency.pojo.ErrorMsg;
import edu.nus.currency.pojo.ErrorMsgEnum;
import edu.nus.currency.pojo.ReqEntity.UpdateSingleSubscriptionReq;
import edu.nus.currency.pojo.ResEntity.JWTPayload;
import edu.nus.currency.pojo.ReqEntity.UpdateCurrencyReq;
import edu.nus.currency.security.JwtTokenManager;
import edu.nus.currency.service.CurrencyService;
import edu.nus.currency.service.SubscriptionService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/currencies")
public class CurrencyController {
    @Resource
    CurrencyService currencyService;

    @Resource
    SubscriptionService subscriptionService;

    @PutMapping("")
    public ResponseEntity<Object> updateCurrencies(@Valid @RequestBody UpdateCurrencyReq updateCurrencyReq, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return currencyService.updateCurrenciesService(updateCurrencyReq);
    }

    @GetMapping("")
    public ResponseEntity<Object> getPreferredCurrency(@CookieValue(value = "access_token", required = false) String token,@RequestParam String preferredCurrency) {
        JWTPayload decodedToken = JwtTokenManager.decodeAccessToken(token);
//        String preferredCurrency = decodedToken.getPreferredCurrency();
        return currencyService.getPreferredCurrencyService(preferredCurrency);
    }

    @PostMapping("")
    public ResponseEntity<Object> updateSingleSubscription(@RequestBody UpdateSingleSubscriptionReq req) {
        return subscriptionService.UpdateSingleSubscription(req);
    }


}
