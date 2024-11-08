package edu.nus.currency.service;

import edu.nus.currency.pojo.UpdExgRatReq;
import org.springframework.http.ResponseEntity;

public interface ExchangeRateService {
    ResponseEntity<Object> updateCurrenciesService(UpdExgRatReq req);

    ResponseEntity<Object> getPreferredCurrencyService(String preferredCurrency);
}
