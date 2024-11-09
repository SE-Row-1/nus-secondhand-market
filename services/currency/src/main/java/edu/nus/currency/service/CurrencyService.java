package edu.nus.currency.service;

import edu.nus.currency.pojo.ReqEntity.UpdExgRatReq;
import org.springframework.http.ResponseEntity;

public interface CurrencyService {
    ResponseEntity<Object> updateCurrenciesService(UpdExgRatReq req);

    ResponseEntity<Object> getPreferredCurrencyService(String preferredCurrency);
}
