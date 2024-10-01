package edu.nus.market;

import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.LoginReq;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

@SpringBootTest
public class LoginServiceTest {
    @Resource
    AccountService accountService;



    @Test
    void loginSuccessTest(){
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("e1351826@u.nus.edu");
        loginReq.setPassword("12345678");

        assert (accountService.loginService(loginReq).getStatusCode().equals(HttpStatusCode.valueOf(HttpStatus.CREATED.value())));
    }

    @Test
    void loginWrongPasswordTest(){
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("e1351826@u.nus.edu");
        loginReq.setPassword("0");

        assert (accountService.loginService(loginReq).equals(ResponseEntity.status(HttpStatus.UNAUTHORIZED).
            body(new ErrorMsg(ErrorMsgEnum.WRONG_PASSWORD.ErrorMsg))));
    }

    @Test
    void loginAccountNotFoundTest(){
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("e0351856@u.nus.edu");
        loginReq.setPassword("12345678");

        assert (accountService.loginService(loginReq).equals(ResponseEntity.status(HttpStatus.NOT_FOUND).
            body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg))));
    }

}
