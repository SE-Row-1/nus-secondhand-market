package edu.nus.market;


import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

@SpringBootTest
public class GetAccountServiceTest{
    @Resource
    AccountService accountService;

    @Test
    void getAccountSuccessTest(){

        assert (accountService.getAccountService(60).getStatusCode().equals(HttpStatusCode.valueOf(HttpStatus.OK.value())));
    }

    @Test
    void getAccountNotFoundTest(){
        assert (accountService.getAccountService(0).equals(ResponseEntity.status(HttpStatus.NOT_FOUND).
            body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg))));
    }
}
