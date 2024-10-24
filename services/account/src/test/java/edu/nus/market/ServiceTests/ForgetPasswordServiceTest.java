package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.ForgetPasswordReq;
import edu.nus.market.pojo.ReqEntity.RegisterReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.pojo.data.EmailTransaction;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ForgetPasswordServiceTest {

    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    @Resource
    EmailTransactionDao emailTransactionDao;

    private static final String EMAIL = "e1351826@u.nus.edu";
    private static final String OLD_PASSWORD = "oldPassword123";
    private static final String NEW_PASSWORD = "newPassword456";
    private static int userId;
    private static UUID uuid;

    @BeforeAll
    void setup() {
        accountDao.cleanTable();
        Account account = new Account();
        account.setEmail(EMAIL);
        account.setPasswordHash(OLD_PASSWORD);
        account.setPasswordSalt("salt");
        accountDao.registerNewAccount(account);

        emailTransactionDao.cleanTable();
        uuid = emailTransactionDao.insertEmailTransaction(new EmailTransaction(EMAIL, "reset-password"));
        emailTransactionDao.verifyEmailTransaction(uuid);

        userId = accountDao.getAccountByEmail(EMAIL).getId();
    }

    @Test
    void forgetPasswordSuccessTest() {
        ForgetPasswordReq forgetPasswordReq = new ForgetPasswordReq();
        forgetPasswordReq.setId(uuid);
        forgetPasswordReq.setNewPassword(NEW_PASSWORD);

        ResponseEntity<Object> response = accountService.forgetPasswordService(forgetPasswordReq);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        Account updatedAccount = accountDao.getAccountById(userId);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        assertTrue(passwordEncoder.matches(NEW_PASSWORD + updatedAccount.getPasswordSalt(), updatedAccount.getPasswordHash()));
    }

    @Test
    void forgetPasswordEmailNotVerifiedTest() {
        ForgetPasswordReq forgotPasswordReq = new ForgetPasswordReq();
        forgotPasswordReq.setId(UUID.randomUUID());
        forgotPasswordReq.setNewPassword(NEW_PASSWORD);

        ResponseEntity<Object> response = accountService.forgetPasswordService(forgotPasswordReq);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.EMAIL_NOT_VERIFIED.ErrorMsg), response.getBody());
    }

    @AfterAll
    void cleanup() {
        accountDao.cleanTable();
    }
}
