package edu.nus.market;

import edu.nus.market.pojo.LoginReq;
import edu.nus.market.pojo.Register;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.controller.AccountController;
import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.DepartmentDao;
import edu.nus.market.pojo.*;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;


@SpringBootTest
class MarketApplicationTests {


    @Resource
    AccountDao accountDao;

    @Resource
    DepartmentDao departmentDao;

    @Resource
    AccountService accountService;

    @Resource
    AccountController accountController;

	@Test
	void contextLoads() {
        Department de = departmentDao.getDepartById(1);
        assert(de != null);

	}

    @Test
    void registerSuccessTest(){
        Register register = new Register();
        register.setEmail("e1351847@u.nus.edu");
        register.setPassword("12345678");
        register.setDepartmentId(1);

        assert (accountService.registerService(register).getStatusCode().equals(HttpStatusCode.valueOf(201)));
    }

    @Test
    void registerAccountConflictTest(){
        Register register = new Register();
        register.setEmail("e1351826@u.nus.edu");
        register.setPassword("12345678");
        register.setDepartmentId(1);
        assert (accountService.registerService(register).equals(ResponseEntity.status(HttpStatus.CONFLICT).
            body(new ErrorMsg("This email is already registered."))));
    }

    @Test
    void loginSuccessTest(){
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("e1351826@u.nus.edu");
        loginReq.setPassword("12345678");

        assert (accountService.loginService(loginReq).getStatusCode().equals(HttpStatusCode.valueOf(200)));
    }

    @Test
    void loginWrongPasswordTest(){
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("e1351826@u.nus.edu");
        loginReq.setPassword("0");

        assert (accountService.loginService(loginReq).getStatusCode().equals(HttpStatusCode.valueOf(401)));
    }

    @Test
    void loginAccountNotFoundTest(){
        LoginReq loginReq = new LoginReq();
        loginReq.setEmail("e1351856@u.nus.edu");
        loginReq.setPassword("12345678");

        assert (accountService.loginService(loginReq).getStatusCode().equals(HttpStatusCode.valueOf(404)));
    }

    @Test
    void testTokenEncoderandDecoder(){
        int userid = 15;

        String token = JwtTokenManager.generateAccessToken(userid);
        assert (userid == (JwtTokenManager.decodeAccessToken(token)));
    }

}
