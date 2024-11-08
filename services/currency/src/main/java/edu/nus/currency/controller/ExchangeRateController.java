package edu.nus.currency.controller;

import edu.nus.currency.pojo.ErrorMsg;
import edu.nus.currency.pojo.ErrorMsgEnum;
import edu.nus.currency.pojo.ResEntity.JWTPayload;
import edu.nus.currency.pojo.UpdExgRatReq;
import edu.nus.currency.security.JwtTokenManager;
import edu.nus.currency.service.ExchangeRateService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/exchange")
public class ExchangeRateController {
    @Resource
    ExchangeRateService exchangeRateService;

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

}
