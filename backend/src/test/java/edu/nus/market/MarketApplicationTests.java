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
    void testTokenEncoderandDecoder(){
        int userid = 15;

        String token = JwtTokenManager.generateAccessToken(userid);
        assert (userid == (JwtTokenManager.decodeAccessToken(token)));
    }

}
