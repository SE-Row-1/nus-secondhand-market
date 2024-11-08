package edu.nus.currency.controller;

import edu.nus.currency.pojo.ErrorMsg;
import edu.nus.currency.pojo.ErrorMsgEnum;
import edu.nus.currency.pojo.UpdExgRatReq;
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

    @GetMapping ("")
    public ResponseEntity<Object> updateExchangeRate(@Valid @RequestBody UpdExgRatReq updExgRatReq, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMsg(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
        }
        return exchangeRateService.updateExchangeRate(updExgRatReq);
    }

}
