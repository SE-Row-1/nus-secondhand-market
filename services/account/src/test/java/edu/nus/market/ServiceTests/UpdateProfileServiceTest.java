package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.RegisterReq;
import edu.nus.market.pojo.ReqEntity.UpdateProfileReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.pojo.data.EmailTransaction;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UpdateProfileServiceTest {

    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    @Resource
    EmailTransactionDao emailTransactionDao;

    private static final String EMAIL = "e1351826@u.nus.edu";
    private static final String PASSWORD = "12345678";
    private static final String NICKNAME = "Nickname";
    private static final String UUID = "1";
    private static int ID;

    @BeforeAll
    @Order(1)
    void setup() {
        accountDao.cleanTable();
        emailTransactionDao.cleanTable();

        Account account = new Account();
        account.setEmail(EMAIL);
        account.setPasswordHash(PASSWORD);
        account.setPasswordSalt(PASSWORD);
        accountDao.registerNewAccount(account);

        ID = accountDao.getAccountByEmail(EMAIL).getId();

        emailTransactionDao.insertEmailTransaction(new EmailTransaction(UUID, EMAIL, "123456"));
        emailTransactionDao.verifyEmailTransaction(UUID);
    }

    @Test
    @Order(2)
    void updateProfileSuccessTest() {
        UpdateProfileReq updateProfileReq = new UpdateProfileReq();
        updateProfileReq.setNickname("Nickname");
        updateProfileReq.setAvatarUrl("https://new-avatar.com/avatar.png");
        updateProfileReq.setPhoneCode("65");
        updateProfileReq.setPhoneNumber("98765432");
        updateProfileReq.setDepartmentId(1);
        updateProfileReq.setPreferredCurrency("SGD");

        ResponseEntity<Object> response = accountService.updateProfileService(updateProfileReq, ID);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Account updatedAccount = accountDao.getAccountById(ID);
        assertEquals("Nickname", updatedAccount.getNickname());
        assertEquals("https://new-avatar.com/avatar.png", updatedAccount.getAvatarUrl());
        assertEquals("65", updatedAccount.getPhoneCode());
        assertEquals("98765432", updatedAccount.getPhoneNumber());
        assertEquals(1, updatedAccount.getDepartmentId());
        assertEquals("SGD", updatedAccount.getPreferredCurrency());

        ResAccount resAccount = (ResAccount) response.getBody();
        assertNotNull(resAccount);
        assertEquals("Nickname", resAccount.getNickname());
        assertEquals("https://new-avatar.com/avatar.png", resAccount.getAvatarUrl());
        assertEquals("65", resAccount.getPhoneCode());
        assertEquals("98765432", resAccount.getPhoneNumber());
        assertEquals(1, resAccount.getDepartmentId());
        assertEquals("SGD", resAccount.getPreferredCurrency());
    }

    @Test
    @Order(3)
    void updateProfileAccountNotFoundTest() {
        UpdateProfileReq updateProfileReq = new UpdateProfileReq();
        updateProfileReq.setNickname("New Nickname");

        ResponseEntity<Object> response = accountService.updateProfileService(updateProfileReq, ID + 1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg), response.getBody());
    }

    @Test
    @Order(4)
    void updateProfileEmailConflictTest() {


        UpdateProfileReq updateProfileReq = new UpdateProfileReq();
        updateProfileReq.setId(UUID + "1");

        ResponseEntity<Object> response = accountService.updateProfileService(updateProfileReq, ID);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.EMAIL_NOT_VERIFIED.ErrorMsg), response.getBody());
    }

    @Test
    @Order(5)
    void updatePartialProfileTest() {
        UpdateProfileReq updateProfileReq = new UpdateProfileReq();
        updateProfileReq.setNickname("New Nickname");

        ResponseEntity<Object> response = accountService.updateProfileService(updateProfileReq, ID);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        ResAccount resAccount = (ResAccount) response.getBody();
        assertNotNull(resAccount);
        assertEquals("New Nickname", resAccount.getNickname());

        Account updatedAccount = accountDao.getAccountById(ID);
        assertEquals("New Nickname", updatedAccount.getNickname());
        assertEquals("https://new-avatar.com/avatar.png", updatedAccount.getAvatarUrl());
        assertEquals("65", updatedAccount.getPhoneCode());
        assertEquals("98765432", updatedAccount.getPhoneNumber());
    }


    @AfterAll
    void cleanup() {
        accountDao.cleanTable();
    }
}
