package edu.nus.market.service;

import edu.nus.market.pojo.Account;
import edu.nus.market.pojo.LoginReq;
import edu.nus.market.pojo.Register;
import edu.nus.market.pojo.Response;
import org.springframework.http.ResponseEntity;

public interface AccountService {
    Account getMyAccount(int id);

    ResponseEntity<Object> loginService(LoginReq req);

    ResponseEntity<Object> registerService(Register register);
}
