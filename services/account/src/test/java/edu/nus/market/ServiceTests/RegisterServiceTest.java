package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
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
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RegisterServiceTest {

    @Resource
    AccountService accountService;

    @Resource
    AccountDao accountDao;

    private static final String EMAIL = "e1351827@u.nus.edu";
    private static final String PASSWORD = "12345678";

    @BeforeAll
    void setup(){
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

    @AfterAll
    void cleanup(){
        accountDao.cleanTable();
    }

    private RegisterReq createRegisterReq() {
        RegisterReq registerReq = new RegisterReq();
        registerReq.setEmail(EMAIL);
        registerReq.setPassword(PASSWORD);
        return registerReq;
    }
}
