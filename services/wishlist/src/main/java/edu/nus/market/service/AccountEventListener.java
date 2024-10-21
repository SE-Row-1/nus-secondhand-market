package edu.nus.market.service;

import edu.nus.market.pojo.Item;
import edu.nus.market.pojo.ResEntity.ResAccount;

public interface AccountEventListener {
    void handleAccountDeleted(String userId);
}
