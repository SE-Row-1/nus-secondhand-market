package edu.nus.market.service;


import edu.nus.market.pojo.Account;
import edu.nus.market.pojo.ResEntity.ResAccount;

public interface AccountEventListener {
    void handleAccountDeleted(String userId);

    void handleAccountUpdated(Account updatedAccount);
}
