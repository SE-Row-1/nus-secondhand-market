package edu.nus.market;

import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.Register;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

@SpringBootTest
public class RegistServiceTest {
    @Resource
    AccountService accountService;

    @Test
    void registerSuccessTest(){
        Register register = new Register();
        register.setEmail("e1351889@u.nus.edu");
        register.setPassword("12345678");
        assert (accountService.registerService(register).getStatusCode().equals(HttpStatusCode.valueOf(HttpStatus.CREATED.value())));
        // we can't hard code the information inside
    }

    @Test
    void registerAccountConflictTest(){
        Register register = new Register();
        register.setEmail("e1351886@u.nus.edu");
        register.setPassword("12345678");
        assert (accountService.registerService(register).equals(ResponseEntity.status(HttpStatus.CONFLICT).
            body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg))));
    }
}
