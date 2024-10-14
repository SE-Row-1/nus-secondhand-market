package edu.nus.market;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
import edu.nus.market.pojo.ReqBody.RegisterReq;
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
        assertNotNull(accountDao.getAccountByEmail("e1351826@u.nus.edu"));
        assertTrue(registerResponse.getBody() instanceof ResAccount);
    }

    @Test
    @Order(2)
    void registerAccountConflictTest(){
        RegisterReq registerReq = createRegisterReq();

        ResponseEntity<Object> conflictResponse = accountService.registerService(registerReq);
        assertEquals(HttpStatus.CONFLICT, conflictResponse.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg), conflictResponse.getBody());
    }

    @AfterAll
    void cleanup(){
        accountDao.deleteAccountByEmail("e1351826@u.nus.edu");
    }

    private RegisterReq createRegisterReq() {
        RegisterReq registerReq = new RegisterReq();
        registerReq.setEmail("e1351826@u.nus.edu");
        registerReq.setPassword("12345678");
        return registerReq;
    }
}
