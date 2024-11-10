package edu.nus.currency.service;

import edu.nus.currency.pojo.ReqEntity.UpdateCurrencyReq;
import edu.nus.currency.pojo.ReqEntity.UpdateSingleSubscriptionReq;
import org.springframework.http.ResponseEntity;

public interface CurrencyService {
    ResponseEntity<Object> updateCurrenciesService(UpdateCurrencyReq req);

    ResponseEntity<Object> getPreferredCurrencyService(String preferredCurrency);

}
