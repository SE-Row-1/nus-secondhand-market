package edu.nus.market.service;

import edu.nus.market.pojo.Account;
import org.springframework.http.ResponseEntity;

public interface AccountService {
    Account getMyAccount(int id);

    ResponseEntity<Account> resgister(Account account);
}
