//package edu.nus.market.ServiceTests;
//
//import edu.nus.market.dao.AccountDao;
//import edu.nus.market.pojo.data.Account;
//import edu.nus.market.pojo.ErrorMsg;
//import edu.nus.market.pojo.ErrorMsgEnum;
//import edu.nus.market.pojo.ReqEntity.RegisterReq;
//import edu.nus.market.pojo.ReqEntity.UpdPswReq;
//import edu.nus.market.pojo.ResEntity.ResAccount;
//import edu.nus.market.service.AccountService;
//import jakarta.annotation.Resource;
//import org.junit.jupiter.api.*;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@TestInstance(TestInstance.Lifecycle.PER_CLASS)
//@SpringBootTest
//public class UpdatePasswordServiceTest {
//    @Resource
//    AccountService accountService;
//
//    @Resource
//    AccountDao accountDao;
//
//    private static final String EMAIL = "e1351826@u.nus.edu";
//    private static final String OLD_PASSWORD = "oldPassword123";
//    private static final String NEW_PASSWORD = "newPassword456";
//    private static int userId;
//
//    @BeforeAll
//    void setup() {
//        accountDao.cleanTable();
//        ResAccount resAccount = (ResAccount) accountService.registerService(new RegisterReq(EMAIL, OLD_PASSWORD)).getBody();
//        userId = resAccount.getId();
//    }
//
//    @Test
//    void updatePasswordSuccessTest() {
//        UpdPswReq req = new UpdPswReq();
//        req.setOldPassword(OLD_PASSWORD);
//        req.setNewPassword(NEW_PASSWORD);
//
//        ResponseEntity<Object> response = accountService.updatePasswordService(req, userId);
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//
//        ResAccount resAccount = (ResAccount) response.getBody();
//        assertNotNull(resAccount);
//
//        Account updatedAccount = accountDao.getAccountById(userId);
//        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        assertTrue(passwordEncoder.matches(NEW_PASSWORD + updatedAccount.getPasswordSalt(), updatedAccount.getPasswordHash()));
//    }
//
//    @Test
//    void updatePasswordAccountNotFoundTest() {
//        UpdPswReq req = new UpdPswReq();
//        req.setOldPassword(OLD_PASSWORD);
//        req.setNewPassword(NEW_PASSWORD);
//
//        ResponseEntity<Object> response = accountService.updatePasswordService(req, userId + 1);
//
//        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
//        assertEquals(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg), response.getBody());
//    }
//
//    @Test
//    void updatePasswordWrongOldPasswordTest() {
//        UpdPswReq req = new UpdPswReq();
//        req.setOldPassword("wrongPassword");
//        req.setNewPassword(NEW_PASSWORD);
//
//        ResponseEntity<Object> response = accountService.updatePasswordService(req, userId);
//
//        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
//        assertEquals(new ErrorMsg(ErrorMsgEnum.WRONG_PASSWORD.ErrorMsg), response.getBody());
//    }
//
//    @AfterAll
//    void cleanup() {
//        accountDao.cleanTable();
//    }
//}
