package edu.nus.market.service;

import edu.nus.market.pojo.ReqEntity.UpdateCurrencyReq;
import org.springframework.http.ResponseEntity;

public interface CurrencyService {

    ResponseEntity<Object> getCurrencyListService();

    ResponseEntity<Object> updateCurrenciesService(UpdateCurrencyReq req);

    ResponseEntity<Object> getPreferredCurrencyService(String preferredCurrency);

    void scheduleUpdateCurrencies();

}
