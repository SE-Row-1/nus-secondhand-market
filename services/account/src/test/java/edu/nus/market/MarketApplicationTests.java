package edu.nus.market;

import edu.nus.market.pojo.ReqEntity.RegisterReq;
import edu.nus.market.pojo.ReqEntity.UpdPswReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
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
}
