package edu.nus.market.service;

import edu.nus.market.pojo.UpdExgRatReq;
import org.springframework.http.ResponseEntity;

public interface ExchangeRateService {
    ResponseEntity<Object> updateExchangeRate(UpdExgRatReq req);

}
