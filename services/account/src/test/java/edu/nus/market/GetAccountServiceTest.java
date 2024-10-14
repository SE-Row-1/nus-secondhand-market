package edu.nus.market;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.RegisterReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class GetAccountServiceTest {

    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    private static int userId;

    @BeforeAll
    void setup() {
        accountDao.cleanTable();

        if (accountDao.getAccountByEmail("e1351826@u.nus.edu") == null) {
            RegisterReq registerReq = new RegisterReq();
            registerReq.setEmail("e1351826@u.nus.edu");
            registerReq.setPassword("12345678");

            ResponseEntity<Object> responseEntity = accountService.registerService(registerReq);
            assertNotNull(responseEntity.getBody());
            assertInstanceOf(ResAccount.class, responseEntity.getBody());

            ResAccount resAccount = (ResAccount) responseEntity.getBody();
            userId = resAccount.getId();
        }
    }

    @Test
    void getAccountSuccessTest() {
        ResponseEntity<Object> responseEntity = accountService.getAccountService(userId);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());

        assertNotNull(responseEntity.getBody());
        assertTrue(responseEntity.getBody() instanceof ResAccount);
    }

    @Test
    void getAccountNotFoundTest() {
        ResponseEntity<Object> responseEntity = accountService.getAccountService(userId + 1);
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());

        ErrorMsg expectedErrorMsg = new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg);
        assertEquals(expectedErrorMsg, responseEntity.getBody());
    }

    @Test
    void getAccountDeletedTest() {
        accountDao.deleteAccount(userId);

        ResponseEntity<Object> responseEntity = accountService.getAccountService(userId);
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());

        ErrorMsg expectedErrorMsg = new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg);
        assertEquals(expectedErrorMsg, responseEntity.getBody());
    }

    @AfterAll
    void cleanUp() {
        if (userId != 0) {
            accountDao.hardDeleteAccount(userId);
        }
    }
}
