package edu.nus.market.service;


import edu.nus.market.pojo.*;
import org.springframework.http.ResponseEntity;

public interface AccountService {
    ResponseEntity<Object> getAccountService(int id);

    ResponseEntity<Object> forgotPasswordService(ForgotPasswordReq forgotPasswordReq);

    ResponseEntity<Object> loginService(LoginReq req);

    ResponseEntity<Object> registerService(RegisterReq registerReq);

    ResponseEntity<Object> deleteAccountService( int id);

    ResponseEntity<Object> updatePasswordService(UpdPswReq req, int id);

    ResponseEntity<Object> updateProfileService(UpdateProfileReq req, int id);

    ResponseEntity<Object> logoutService();
}
