package edu.nus.market.service;

import edu.nus.market.pojo.*;
import org.springframework.http.ResponseEntity;

public interface AccountService {
    Account getMyAccount(int id);

    ResponseEntity<Object> resetPasswordService(ResetPasswordReq resetPasswordReq);

    ResponseEntity<Object> loginService(LoginReq req);

    ResponseEntity<Object> registerService(Register register);

    ResponseEntity<Object> deleteAccountService(DelAccReq req);
}
