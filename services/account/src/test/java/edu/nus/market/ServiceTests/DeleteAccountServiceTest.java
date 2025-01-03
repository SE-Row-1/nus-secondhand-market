package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.service.AccountServiceImpl;
import edu.nus.market.service.MQService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class DeleteAccountServiceTest {

    @Spy  // 使用 Spy 进行部分模拟
    @InjectMocks
    private AccountServiceImpl accountService;  // 使用具体实现类

    @Mock
    private AccountDao accountDao;  // 模拟 AccountDao

    @Mock
    private MQService mqService;  // 模拟 MQService

    @Mock
    EmailTransactionDao emailTransactionDao;

    private static final String EMAIL = "e1351827@u.nus.edu";
    private static final String PASSWORD = "12345678";
    private static final int ID = 1;
    private static Account account;

    @BeforeAll
    void setup() {
        // 初始化 Mockito 模拟对象
        MockitoAnnotations.openMocks(this);  // 确保模拟对象初始化

        // 模拟 accountDao.cleanTable() 方法
        doNothing().when(accountDao).cleanTable();

        account = new Account(ID, EMAIL, "test", "hash", "salt", "avatar", 1, "code", "number", "CNY", "2023-05-01", null);
    }

    @Test
    void deleteSuccessTest() {
        // 模拟 MQ 消息不发送实际消息
        doNothing().when(mqService).sendDeleteMessage(anyString());

        // 模拟账号存在
        when(accountDao.getAccountById(ID)).thenReturn(account);

        // 执行删除操作
        ResponseEntity<Object> response = accountService.deleteAccountService(ID);

        // 验证删除操作的 HTTP 状态
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        // 验证 Set-Cookie 头信息是否正确
        String setCookieHeader = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        assertEquals("access_token=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax", setCookieHeader);

        // 验证账号已被删除
        verify(accountDao, times(1)).softDeleteAccount(ID);
        when(accountDao.getAccountById(ID)).thenReturn(null);
        assertNull(accountDao.getAccountById(ID));  // 假设删除后查询不到账号
    }

    @Test
    void deleteAccountNotFoundTest() {
        // 模拟删除不存在的账号
        when(accountDao.getAccountById(-ID)).thenReturn(null);

        // 执行删除不存在账号的操作
        ResponseEntity<Object> response = accountService.deleteAccountService(-ID);

        // 验证返回的状态码
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        // 验证返回的错误信息
        assertEquals(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg), response.getBody());
    }
}

