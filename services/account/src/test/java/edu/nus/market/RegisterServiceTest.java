package edu.nus.market;

import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.RegisterReq;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

@SpringBootTest
public class RegisterServiceTest {
    @Resource
    AccountService accountService;

    @Test
    void registerSuccessTest(){
        RegisterReq registerReq = new RegisterReq();
        registerReq.setEmail("e1351898@u.nus.edu");
        registerReq.setPassword("12345678");
        assert (accountService.registerService(registerReq).getStatusCode().equals(HttpStatusCode.valueOf(HttpStatus.CREATED.value())));
        // we can't hard code the information inside
    }

    @Test
    void registerAccountConflictTest(){
        RegisterReq registerReq = new RegisterReq();
        registerReq.setEmail("e1351886@u.nus.edu");
        registerReq.setPassword("12345678");
        assert (accountService.registerService(registerReq).equals(ResponseEntity.status(HttpStatus.CONFLICT).
            body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg))));
    }
}
