package edu.nus.market.service.account;

import edu.nus.market.pojo.account.*;
import org.springframework.http.ResponseEntity;

public interface AccountService {
    Account getMyAccount(int id);

    ResponseEntity<Object> forgotPasswordService(ForgotPasswordReq forgotPasswordReq);

    ResponseEntity<Object> loginService(LoginReq req);

    ResponseEntity<Object> registerService(Register register);

    ResponseEntity<Object> deleteAccountService(DelAccReq req);

    ResponseEntity<Object> updatePasswordService(UpdPswReq req);
}
