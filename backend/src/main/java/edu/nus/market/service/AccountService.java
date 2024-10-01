package edu.nus.market.service;


import edu.nus.market.pojo.*;
import org.springframework.http.ResponseEntity;

public interface AccountService {
    ResponseEntity<Object> getMyAccount(int id);

    ResponseEntity<Object> forgotPasswordService(ForgotPasswordReq forgotPasswordReq);

    ResponseEntity<Object> loginService(LoginReq req);

    ResponseEntity<Object> registerService(Register register);

    ResponseEntity<Object> deleteAccountService(DelAccReq req, int id);

    ResponseEntity<Object> updatePasswordService(UpdPswReq req, int id);

    ResponseEntity<Object> updateProfileService(UpdateProfileReq req, int id);

}
