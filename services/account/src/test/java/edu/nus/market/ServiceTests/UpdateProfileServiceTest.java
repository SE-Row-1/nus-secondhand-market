package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.Account;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.RegisterReq;
import edu.nus.market.pojo.ReqEntity.UpdateProfileReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
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

    private static final String EMAIL = "e1351826@u.nus.edu";
    private static final String PASSWORD = "12345678";
    private static int ID;

    @BeforeAll
    @Order(1)
    void setup() {
        accountDao.cleanTable();
        ResAccount resAccount = (ResAccount) accountService.registerService(new RegisterReq(EMAIL, PASSWORD)).getBody();
        ID = resAccount.getId();
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
        accountService.registerService(new RegisterReq("e1351827@u.nus.edu", "87654321"));

        UpdateProfileReq updateProfileReq = new UpdateProfileReq();
        updateProfileReq.setEmail("e1351827@u.nus.edu");

        ResponseEntity<Object> response = accountService.updateProfileService(updateProfileReq, ID);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg), response.getBody());
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
        accountDao.deleteAccountByEmail(EMAIL);
        accountDao.deleteAccountByEmail("e1351827@u.nus.edu");
        accountDao.deleteAccountByEmail("e1351826@u.nus.edu");
    }
}
