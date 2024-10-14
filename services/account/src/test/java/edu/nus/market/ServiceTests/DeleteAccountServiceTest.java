package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.RegisterReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class DeleteAccountServiceTest {
    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    private static final String EMAIL = "e1351827@u.nus.edu";
    private static final String PASSWORD = "12345678";
    private static int ID;

    @BeforeAll
    void setup() {
        accountDao.cleanTable();
        ResAccount resAccount = (ResAccount) accountService.registerService(new RegisterReq(EMAIL, PASSWORD)).getBody();
        ID = resAccount.getId();
    }

    @Test
    void deleteSuccessTest() {
        ResponseEntity<Object> response = accountService.deleteAccountService(ID);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        String setCookieHeader = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        assertEquals("access_token=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax", setCookieHeader);

        assertNull(accountDao.getAccountById(ID));
    }

    @Test
    void deleteAccountNotFoundTest() {
        ResponseEntity<Object> response = accountService.deleteAccountService(-ID);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg), response.getBody());
    }

    @AfterAll
    void cleanup() {
        accountDao.deleteAccountByEmail(EMAIL);
    }
}
