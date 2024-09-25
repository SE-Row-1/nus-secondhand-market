package edu.nus.market;

import edu.nus.market.controller.AccountController;
import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.DepartmentDao;
import edu.nus.market.pojo.Account;
import edu.nus.market.pojo.Department;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.Register;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.sql.SQLOutput;

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
    void registerAccountConflictTest(){
        Register register = new Register();
        register.setEmail("e1351826@u.nus.edu");
        register.setPassword("12345678");
        register.setDepartmentId(1);
        assert (accountController.register(register).equals(ResponseEntity.status(HttpStatus.CONFLICT).
            body(new ErrorMsg("This email is already registered."))));
    }

    @Test
    void registerSuccessTest(){
        Register register = new Register();
        register.setEmail("e1351828@u.nus.edu");
        register.setPassword("12345678");
        register.setDepartmentId(1);

        assert (accountController.register(register).getStatusCode().equals(HttpStatusCode.valueOf(200)));
    }
}
