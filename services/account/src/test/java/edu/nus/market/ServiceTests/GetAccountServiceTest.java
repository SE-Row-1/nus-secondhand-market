package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.pojo.data.EmailTransaction;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class GetAccountServiceTest {

    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    @Resource
    EmailTransactionDao emailTransactionDao;

    private static final String EMAIL = "e1351826@u.nus.edu";
    private static final String PASSWORD = "oldPassword123";
    private static int userId;
    private static UUID uuid;

    @BeforeAll
    void setup() {
        accountDao.cleanTable();

        Account account = new Account();
        account.setEmail(EMAIL);
        account.setPasswordHash(PASSWORD);
        account.setPasswordSalt("salt");
        accountDao.registerNewAccount(account);

        emailTransactionDao.cleanTable();
        uuid = emailTransactionDao.insertEmailTransaction(new EmailTransaction(EMAIL, "reset-password"));
        emailTransactionDao.verifyEmailTransaction(uuid);

        userId = accountDao.getAccountByEmail(EMAIL).getId();
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
        accountDao.softDeleteAccount(userId);

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
