package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.*;
import edu.nus.market.pojo.ReqEntity.RegisterReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
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
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RegisterServiceTest {

    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    @Resource
    EmailTransactionDao emailTransactionDao;

    private static UUID ID;
    private static final String NICKNAME = "test";
    private static final String EMAIL = "e1351827@u.nus.edu";
    private static final String PASSWORD = "12345678";

    @BeforeAll
    void setup(){
        emailTransactionDao.cleanTable();
        ID = emailTransactionDao.insertEmailTransaction(new EmailTransaction(EMAIL, "123456"));
        emailTransactionDao.verifyEmailTransaction(ID);
        accountDao.cleanTable();
    }

    @Test
    @Order(1)
    void registerSuccessTest(){
        RegisterReq registerReq = createRegisterReq();

        ResponseEntity<Object> registerResponse = accountService.registerService(registerReq);

        assertEquals(HttpStatus.CREATED, registerResponse.getStatusCode());
        assertNotNull(accountDao.getAccountByEmail(EMAIL));
        assertInstanceOf (ResAccount.class, registerResponse.getBody());
    }

    @Test
    @Order(2)
    void registerAccountConflictTest(){
        RegisterReq registerReq = createRegisterReq();

        ResponseEntity<Object> conflictResponse = accountService.registerService(registerReq);
        assertEquals(HttpStatus.CONFLICT, conflictResponse.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg), conflictResponse.getBody());
    }

    @Test
    @Order(3)
    void registerDeletedAccountTest(){
        RegisterReq registerReq = createRegisterReq();

        int id = accountDao.getAccountByEmail(EMAIL).getId();
        accountDao.softDeleteAccountByEmail(EMAIL);

        ResponseEntity<Object> registerResponse = accountService.registerService(registerReq);
        assertEquals(HttpStatus.CREATED, registerResponse.getStatusCode());
        assertNotNull(accountDao.getAccountByEmail(EMAIL));
        assertInstanceOf (ResAccount.class, registerResponse.getBody());
        assertNotEquals(id, accountDao.getAccountByEmail(EMAIL).getId());
    }

    @Test
    @Order(4)
    void registerAccountWithNicknameTest(){
        accountDao.hardDeleteAccountByEmail(EMAIL);
        RegisterReq registerReq = createRegisterReq();
        registerReq.setNickname(NICKNAME);

        ResponseEntity<Object> registerResponse = accountService.registerService(registerReq);

        assertEquals(HttpStatus.CREATED, registerResponse.getStatusCode());
        assertNotNull(accountDao.getAccountByEmail(EMAIL));
        assertInstanceOf (ResAccount.class, registerResponse.getBody());
        assertEquals(NICKNAME, ((ResAccount) registerResponse.getBody()).getNickname());
    }

    @AfterAll
    void cleanup(){
        accountDao.cleanTable();
    }

    private RegisterReq createRegisterReq() {
        RegisterReq registerReq = new RegisterReq();
        registerReq.setId(ID);
        registerReq.setPassword(PASSWORD);
        return registerReq;
    }
}
