package edu.nus.market.service;

import edu.nus.market.pojo.ReqEntity.UpdateSingleSubscriptionReq;
import org.springframework.http.ResponseEntity;

public interface SubscriptionService {

    ResponseEntity<Object> UpdateSingleSubscriptionService(UpdateSingleSubscriptionReq updateSingleSubscriptionReq);

    void handleAccountCurrencyDeleted(UpdateSingleSubscriptionReq req);
}
