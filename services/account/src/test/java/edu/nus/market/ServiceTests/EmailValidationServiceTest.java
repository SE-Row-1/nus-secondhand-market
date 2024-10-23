package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.EmailOTPReq;
import edu.nus.market.pojo.ResEntity.EmailMessage;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.security.OTPGenerator;
import edu.nus.market.service.EmailValidationServiceImpl;
import edu.nus.market.service.MQServiceImpl;
import org.mockito.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.*;

public class EmailValidationServiceTest {

    @Spy
    @InjectMocks
    private EmailValidationServiceImpl emailValidationService;

    @Mock
    private AccountDao accountDao;

    @Mock
    private EmailTransactionDao emailTransactionDao;

    @Mock
    private RabbitTemplate rabbitTemplate;  // Mock RabbitTemplate

    @Mock
    private MQServiceImpl mqServiceImpl;  // Mock MQServiceImpl

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendOTPSuccessForRegister() {
        // 构造输入
        EmailOTPReq emailOTPReq = new EmailOTPReq();
        emailOTPReq.setEmail("test@example.com");
        emailOTPReq.setType("register");

        // 模拟 AccountDao 返回 null 表示邮箱未注册
        when(accountDao.getAccountByEmail("test@example.com")).thenReturn(null);

        // 模拟静态 OTP 生成器
        try (MockedStatic<OTPGenerator> mockedOTP = mockStatic(OTPGenerator.class)) {
            mockedOTP.when(() -> OTPGenerator.generateOTP(6)).thenReturn("123456");

            // 模拟 EmailTransactionDao 的 insert 操作
            when(emailTransactionDao.insertEmailTransaction(any())).thenReturn("1");

            // 模拟 RabbitTemplate 的 convertAndSend 方法
            doNothing().when(rabbitTemplate).convertAndSend(eq("email"), eq("Email"), any(EmailMessage.class));

            // 调用测试方法
            ResponseEntity<Object> response = emailValidationService.sendOTP(emailOTPReq);

            // 验证
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());

            // 验证 MQServiceImpl 的 sendEmailMessage 方法被调用，且消息内容正确
            verify(mqServiceImpl, times(1)).sendEmailMessage(any(EmailMessage.class));  // 使用 MQService 验证
        }
    }

    @Test
    public void testSendOTPForAlreadyRegisteredEmail() {
        // 构造输入
        EmailOTPReq emailOTPReq = new EmailOTPReq();
        emailOTPReq.setEmail("test@example.com");
        emailOTPReq.setType("register");

        // 模拟 AccountDao 返回一个账户，表示邮箱已注册
        when(accountDao.getAccountByEmail("test@example.com")).thenReturn(new Account());

        // 调用测试方法
        ResponseEntity<Object> response = emailValidationService.sendOTP(emailOTPReq);

        // 验证
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg), response.getBody());

        // 验证 MQService 的 sendEmailMessage 方法未被调用
        verify(rabbitTemplate, times(0)).convertAndSend(anyString(), anyString(), any(EmailMessage.class));
    }

    @Test
    public void testSendOTPForResetPasswordAccountNotFound() {
        // 构造输入
        EmailOTPReq emailOTPReq = new EmailOTPReq();
        emailOTPReq.setEmail("nonexistent@example.com");
        emailOTPReq.setType("reset_password");

        // 模拟 AccountDao 返回 null 表示邮箱不存在
        when(accountDao.getAccountByEmail("nonexistent@example.com")).thenReturn(null);

        // 调用测试方法
        ResponseEntity<Object> response = emailValidationService.sendOTP(emailOTPReq);

        // 验证结果
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg), response.getBody());

        // 验证 RabbitTemplate 的 sendEmailMessage 未被调用
        verify(rabbitTemplate, times(0)).convertAndSend(anyString(), anyString(), any(EmailMessage.class));
    }


}
