package edu.nus.market;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.LoginReq;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class LoginServiceTest {

    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    private static final String EMAIL = "e1351827@u.nus.edu";
    private static final String PASSWORD = "12345678";

    @BeforeAll
    void setup() {
        accountDao.cleanTable();
        accountService.registerService(new RegisterReq(EMAIL, PASSWORD));
    }

    @Test
    void loginSuccessTest() {
        LoginReq loginReq = createLoginReq(EMAIL, PASSWORD);

        ResponseEntity<Object> response = accountService.loginService(loginReq);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertInstanceOf(ResAccount.class, response.getBody());

        ResAccount resAccount = (ResAccount) response.getBody();
        assertNotNull(resAccount);
        assertEquals(EMAIL, resAccount.getEmail());
    }

    @Test
    void loginWrongPasswordTest() {
        LoginReq loginReq = createLoginReq(EMAIL, "wrong_password");

        ResponseEntity<Object> response = accountService.loginService(loginReq);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.WRONG_PASSWORD.ErrorMsg), response.getBody());
    }

    @Test
    void loginAccountNotFoundTest() {
        LoginReq loginReq = createLoginReq("nonexistent@u.nus.edu", PASSWORD);

        ResponseEntity<Object> response = accountService.loginService(loginReq);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg), response.getBody());
    }

    @AfterAll
    void cleanup() {
        accountDao.deleteAccountByEmail(EMAIL);
    }

    // 辅助方法来创建 LoginReq，减少重复代码
    private LoginReq createLoginReq(String email, String password) {
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail(email);
        loginReq.setPassword(password);
        return loginReq;
    }
}
