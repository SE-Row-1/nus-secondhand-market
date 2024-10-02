package edu.nus.market;

import edu.nus.market.pojo.RegisterReq;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.controller.AccountController;
import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.DepartmentDao;
import edu.nus.market.pojo.*;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;


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

    //test my updatePasswordService in AccountServiceImpl
    @Test
    void updatePasswordSuccessTest(){
        //if account does not exist, register an account
        if(accountDao.getAccountByEmail("e1351826@u.nus.edu") == null){
            RegisterReq registerReq = new RegisterReq();
            registerReq.setEmail("e1351826@u.nus.edu");
            registerReq.setPassword("12345678");
            accountService.registerService(registerReq);
        }
        UpdPswReq req = new UpdPswReq("12345678", "87654321");
        assert (accountService.updatePasswordService(req, accountDao.getAccountByEmail("e1351826@u.nus.edu").getId()).getStatusCode().equals(HttpStatusCode.valueOf(200)));
        //test password wrong
        req = new UpdPswReq("12345678", "87654321");
        assert (accountService.updatePasswordService(req, accountDao.getAccountByEmail("e1351826@u.nus.edu").getId()).getStatusCode().equals(HttpStatusCode.valueOf(401)));
        //delete the test account
        accountService.deleteAccountService(accountDao.getAccountByEmail("e1351826@u.nus.edu").getId());
        assert (accountDao.getAccountByEmail("e1351826@u.nus.edu") == null);

    }


    @Test
    void testTokenEncoderandDecoder(){
        int userid = 15;

        String token = JwtTokenManager.generateAccessToken(userid);
        assert (userid == (JwtTokenManager.decodeAccessToken(token)));
    }

}
