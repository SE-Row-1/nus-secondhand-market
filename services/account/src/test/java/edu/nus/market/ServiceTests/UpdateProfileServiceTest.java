package edu.nus.market.ServiceTests;

import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.UpdateProfileReq;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.pojo.data.EmailTransaction;
import edu.nus.market.service.AccountServiceImpl;
import edu.nus.market.service.MQService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UpdateProfileServiceTest {

    @Spy
    @InjectMocks
    private AccountServiceImpl accountService;

    @Mock
    private AccountDao accountDao;

    @Mock
    private EmailTransactionDao emailTransactionDao;

    @Mock
    private MQService mqService;

    private UpdateProfileReq updateProfileReq;
    private Account account;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Mock `mqService` to avoid sending actual messages
        doNothing().when(mqService).sendUpdateMessage(any());

        // Prepare test data
        account = new Account();
        account.setId(1);
        account.setNickname("test_nickname");

        updateProfileReq = new UpdateProfileReq();
        updateProfileReq.setNickname("updated_nickname");
        updateProfileReq.setAvatarUrl("https://example.com/avatar.png");
        updateProfileReq.setPhoneCode("65");
        updateProfileReq.setPhoneNumber("98765432");
        updateProfileReq.setDepartmentId(1);
        updateProfileReq.setPreferredCurrency("SGD");
    }

    @Test
    public void testUpdateProfile_Success() {
        when(accountDao.getAccountById(1)).thenReturn(account);
        account.setNickname("updated_nickname");
        when(accountDao.updateProfile(any(Account.class), any(Integer.class))).thenReturn(account);


        ResponseEntity<Object> response = accountService.updateProfileService(updateProfileReq, 1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ResAccount resAccount = (ResAccount) response.getBody();
        assertNotNull(resAccount);
        assertEquals("updated_nickname", resAccount.getNickname());
    }

    @Test
    public void testUpdateProfile_AccountNotFound() {
        when(accountDao.getAccountById(1)).thenReturn(null);

        ResponseEntity<Object> response = accountService.updateProfileService(updateProfileReq, 1);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        ErrorMsg errorMsg = (ErrorMsg) response.getBody();
        assertEquals(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg, errorMsg.getError());
    }

    @Test
    public void testUpdateProfile_EmailNotVerified() {
        UUID uuid = UUID.randomUUID();
        updateProfileReq.setId(uuid);

        when(accountDao.getAccountById(1)).thenReturn(account);
        when(emailTransactionDao.getEmailTransactionById(uuid)).thenReturn(new EmailTransaction());

        ResponseEntity<Object> response = accountService.updateProfileService(updateProfileReq, 1);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        ErrorMsg errorMsg = (ErrorMsg) response.getBody();
        assertEquals(ErrorMsgEnum.EMAIL_NOT_VERIFIED.ErrorMsg, errorMsg.getError());
    }

    @Test
    public void testUpdateProfile_EmailConflict() {
        UUID uuid = UUID.randomUUID();
        updateProfileReq.setId(uuid);

        EmailTransaction emailTransaction = new EmailTransaction();
        emailTransaction.setEmail("conflicting@example.com");
        emailTransaction.setVerifiedAt("verified");

        when(accountDao.getAccountById(1)).thenReturn(account);
        when(emailTransactionDao.getEmailTransactionById(uuid)).thenReturn(emailTransaction);
        when(accountDao.getAccountByEmailAll(emailTransaction.getEmail())).thenReturn(new Account());

        ResponseEntity<Object> response = accountService.updateProfileService(updateProfileReq, 1);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        ErrorMsg errorMsg = (ErrorMsg) response.getBody();
        assertEquals(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg, errorMsg.getError());
    }
}
