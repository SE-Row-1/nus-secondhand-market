package edu.nus.market;


import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqBody.RegisterReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class GetAccountServiceTest{
    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    private static int userId;

    @BeforeAll
    void setup(){
        accountDao.cleanTable();
        if(accountDao.getAccountByEmail("e1351826@u.nus.edu") == null){
            RegisterReq registerReq = new RegisterReq();
            registerReq.setEmail("e1351826@u.nus.edu");
            registerReq.setPassword("12345678");
            ResAccount resAccount = (ResAccount)accountService.registerService(registerReq).getBody();
            userId = resAccount.getId();
        }
    }

    @Test
    void getAccountSuccessTest(){
        assert (accountService.getAccountService(userId).getStatusCode().equals(HttpStatusCode.valueOf(HttpStatus.OK.value())));
    }

    @Test
    void getAccountNotFoundTest(){
        assert (accountService.getAccountService(userId + 1).equals(ResponseEntity.status(HttpStatus.NOT_FOUND).
            body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg))));
    }

    @Test
    void getAccountDeletedTest(){
        accountDao.deleteAccount(userId);
        assert (accountService.getAccountService(userId).equals(ResponseEntity.status(HttpStatus.NOT_FOUND).
            body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg))));
    }

    @AfterAll
    void cleanUp(){
        accountDao.hardDeleteAccount(userId);
    }
}
