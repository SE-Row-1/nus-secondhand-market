package edu.nus.market;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.*;
import edu.nus.market.service.AccountService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@SpringBootTest
public class UpdateProfileTest {
    @Resource
    private AccountService accountService;

    @Resource
    private AccountDao accountDao;

    private UpdateProfileReq updateProfileReq;

    private int id;

    @BeforeEach
    void setup(){
        updateProfileReq = new UpdateProfileReq();
        updateProfileReq.setAvatarUrl("https://avatar_url");
        updateProfileReq.setNickname("test");
        updateProfileReq.setPhoneCode("65");
        updateProfileReq.setPhoneNumber("12345678");
        updateProfileReq.setPreferredCurrency("CNY");
        updateProfileReq.setDepartmentId(1);

        String email = "e1351827@u.nus.edu";
        Account account = accountDao.getAccountByEmail(email);
        if (account == null){
            RegisterReq registerReq = new RegisterReq(email, "12345678");
            accountService.registerService(registerReq);
            account = accountDao.getAccountByEmail(email);
        }
        id = account.getId();
    }

    @Test
    void updateProfileSuccessTest(){
        ResponseEntity<Object> responseEntity = accountService.updateProfileService(updateProfileReq, id);
        assert (responseEntity.getStatusCode().equals(HttpStatus.OK));
    }

    @Test
    void updateProfileNotFoundTest(){
        ResponseEntity<Object> responseEntity = accountService.updateProfileService(updateProfileReq, 0);
        assert (responseEntity.equals(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg))));
    }

    @Test
    void updateProfileEmailConflictTest(){
        String email = "e1351826@u.nus.edu";
        Account account = accountDao.getAccountByEmail(email);
        if (account == null){
            RegisterReq registerReq = new RegisterReq(email, "12345678");
            accountService.registerService(registerReq);
        }
        updateProfileReq.setEmail(email);
        ResponseEntity<Object> responseEntity = accountService.updateProfileService(updateProfileReq, id);
        assert (responseEntity.equals(ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg))));
    }

}
