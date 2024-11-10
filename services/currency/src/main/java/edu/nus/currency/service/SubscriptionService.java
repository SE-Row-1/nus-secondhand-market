package edu.nus.currency.service;

import edu.nus.currency.pojo.ReqEntity.UpdateSingleSubscriptionReq;
import org.springframework.http.ResponseEntity;

public interface SubscriptionService {

    ResponseEntity<Object> UpdateSingleSubscription(UpdateSingleSubscriptionReq updateSingleSubscriptionReq);
}
