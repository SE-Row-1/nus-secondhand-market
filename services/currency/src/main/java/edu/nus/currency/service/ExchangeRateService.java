package edu.nus.currency.service;

import edu.nus.currency.pojo.UpdExgRatReq;
import org.springframework.http.ResponseEntity;

public interface ExchangeRateService {
    ResponseEntity<Object> updateExchangeRate(UpdExgRatReq req);

}
