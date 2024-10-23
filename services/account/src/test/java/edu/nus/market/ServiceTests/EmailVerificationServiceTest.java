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
    private static final String WRONG_FORMAT_EMAIL = "e1351827@u.nus";
    private static final String WRONG_EMAIL = "e1351828@u.nus.edu";
    private static int ID;
    private static EmailOTPValidationReq emailOTPValidationReq;

    @BeforeAll
    public void setup() {
        emailTransactionDao.cleanTable();
        ID = emailTransactionDao.insertEmailTransaction(new EmailTransaction(EMAIL, OTP));
    }

    @BeforeEach
    public void resetTable() {
        emailTransactionDao.cleanTable();
        ID = emailTransactionDao.insertEmailTransaction(new EmailTransaction(EMAIL, OTP));
    }

    @Test
    @Order(1)
    public void EmailVerificationSuccessTest() {
        emailOTPValidationReq = new EmailOTPValidationReq(EMAIL, OTP, ID);
        ResponseEntity<Object> response = emailValidationService.validateOTP(emailOTPValidationReq);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    @Order(2)
    public void EmailVerificationWrongOTPTest() {
        emailOTPValidationReq = new EmailOTPValidationReq(EMAIL, WRONG_OTP, ID);
        ResponseEntity<Object> response = emailValidationService.validateOTP(emailOTPValidationReq);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());  // 修改为 UNAUTHORIZED
        assertEquals(new ErrorMsg(ErrorMsgEnum.INVALID_OTP.ErrorMsg), response.getBody());
    }

    @Test
    @Order(3)
    public void EmailVerificationWrongEmailTest() {
        emailOTPValidationReq = new EmailOTPValidationReq(WRONG_EMAIL, OTP, ID);
        ResponseEntity<Object> response = emailValidationService.validateOTP(emailOTPValidationReq);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.EMAIL_NOT_MATCHED.ErrorMsg), response.getBody());
    }

    @Test
    @Order(4)
    public void EmailVerificationWrongIDTest() {
        emailOTPValidationReq = new EmailOTPValidationReq(EMAIL, OTP, ID + 1);
        ResponseEntity<Object> response = emailValidationService.validateOTP(emailOTPValidationReq);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());  // 修改为 NOT_FOUND
        assertEquals(new ErrorMsg(ErrorMsgEnum.TRANSACTION_NOT_FOUND.ErrorMsg), response.getBody());
    }

    @Test
    @Order(5)
    public void EmailVerificationExpiredOTPTest() {
        emailOTPValidationReq = new EmailOTPValidationReq(EMAIL, OTP, ID);
        emailTransactionDao.updateCreatedAt("2023-01-01 00:00:00.000000Z", ID);
        ResponseEntity<Object> response = emailValidationService.validateOTP(emailOTPValidationReq);
        assertEquals(HttpStatus.GONE, response.getStatusCode());  // 修改为 GONE
        assertEquals(new ErrorMsg(ErrorMsgEnum.OTP_EXPIRED.ErrorMsg), response.getBody());
    }

    @AfterAll
    public void cleanup() {
        emailTransactionDao.cleanTable();
    }
}
