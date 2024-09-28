package edu.nus.market.service.exchangeRate;

import edu.nus.market.pojo.exchangeRate.UpdExgRatReq;
import org.springframework.http.ResponseEntity;

public interface ExchangeRateService {
    ResponseEntity<Object> updateExchangeRate(UpdExgRatReq req);

}
