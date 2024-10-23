package edu.nus.market.ServiceTests;

import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.EmailOTPValidationReq;
import edu.nus.market.pojo.data.EmailTransaction;
import edu.nus.market.service.EmailValidationService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EmailVerificationServiceTest {

    @Resource
    EmailValidationService emailValidationService;

    @Resource
    EmailTransactionDao emailTransactionDao;

    private static final String EMAIL = "e1351827@u.nus.edu";
    private static final String OTP = "123456";
    private static final String WRONG_OTP = "654321";
    private static final String ID = "abide";
    private static EmailOTPValidationReq emailOTPValidationReq;

    @BeforeEach
    public void resetTable() {
        emailTransactionDao.cleanTable();
        emailTransactionDao.insertEmailTransaction(new EmailTransaction(ID, EMAIL, OTP));
    }

    @Test
    @Order(1)
    public void EmailVerificationSuccessTest() {
        emailOTPValidationReq = new EmailOTPValidationReq(OTP, ID);
        ResponseEntity<Object> response = emailValidationService.validateOTP(emailOTPValidationReq);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    @Order(2)
    public void EmailVerificationWrongOTPTest() {
        emailOTPValidationReq = new EmailOTPValidationReq(WRONG_OTP, ID);
        ResponseEntity<Object> response = emailValidationService.validateOTP(emailOTPValidationReq);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());  // 修改为 UNAUTHORIZED
        assertEquals(new ErrorMsg(ErrorMsgEnum.INVALID_OTP.ErrorMsg), response.getBody());
    }

    @Test
    @Order(4)
    public void EmailVerificationWrongIDTest() {
        emailOTPValidationReq = new EmailOTPValidationReq(OTP, ID + "1");
        ResponseEntity<Object> response = emailValidationService.validateOTP(emailOTPValidationReq);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.TRANSACTION_NOT_FOUND.ErrorMsg), response.getBody());
    }

    @Test
    @Order(5)
    public void EmailVerificationExpiredOTPTest() {
        emailOTPValidationReq = new EmailOTPValidationReq(OTP, ID);
        emailTransactionDao.updateCreatedAt("2023-01-01 00:00:00.000000Z", ID);
        ResponseEntity<Object> response = emailValidationService.validateOTP(emailOTPValidationReq);
        assertEquals(HttpStatus.GONE, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.OTP_EXPIRED.ErrorMsg), response.getBody());
    }

    @AfterAll
    public void cleanup() {
        emailTransactionDao.cleanTable();
    }
}
