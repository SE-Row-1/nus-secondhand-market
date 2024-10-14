package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.Account;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.ForgetPasswordReq;
import edu.nus.market.pojo.ReqEntity.RegisterReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ForgetPasswordServiceTest {

    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    private static final String EMAIL = "e1351826@u.nus.edu";
    private static final String OLD_PASSWORD = "oldPassword123";
    private static final String NEW_PASSWORD = "newPassword456";
    private static int userId;

    @BeforeAll
    void setup() {
        accountDao.cleanTable();
        ResAccount resAccount = (ResAccount) accountService.registerService(new RegisterReq(EMAIL, OLD_PASSWORD)).getBody();
        userId = resAccount.getId();
    }

    @Test
    void forgetPasswordSuccessTest() {
        ForgetPasswordReq forgetPasswordReq = new ForgetPasswordReq();
        forgetPasswordReq.setEmail(EMAIL);
        forgetPasswordReq.setNewPassword(NEW_PASSWORD);

        ResponseEntity<Object> response = accountService.forgetPasswordService(forgetPasswordReq);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        Account updatedAccount = accountDao.getAccountById(userId);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        assertTrue(passwordEncoder.matches(NEW_PASSWORD + updatedAccount.getPasswordSalt(), updatedAccount.getPasswordHash()));
    }

    @Test
    void forgetPasswordAccountNotFoundTest() {
        ForgetPasswordReq forgotPasswordReq = new ForgetPasswordReq();
        forgotPasswordReq.setEmail("nonexistent@u.nus.edu");
        forgotPasswordReq.setNewPassword(NEW_PASSWORD);

        ResponseEntity<Object> response = accountService.forgetPasswordService(forgotPasswordReq);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg), response.getBody());
    }

    @AfterAll
    void cleanup() {
        accountDao.cleanTable();
    }
}
