package edu.nus.market.ControllerTests;

import edu.nus.market.controller.AccountController;
import edu.nus.market.dao.AccountDao;
import edu.nus.market.dao.EmailTransactionDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.*;
import edu.nus.market.pojo.ResEntity.JWTPayload;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.pojo.data.Account;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.service.AccountService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AccountControllerTest {

    private MockMvc mockMvc;

    private ResAccount resAccount;

    private JWTPayload jwtPayload;

    private Account account;

    private UUID uuid;

    @Mock
    private AccountService accountService;

    @Mock
    private AccountDao accountDao;

    @Mock
    private EmailTransactionDao emailTransactionDao;

    @InjectMocks
    private AccountController accountController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(accountController).build();

        resAccount = new ResAccount(1, "test@u.nus.edu", "test",
            "https://example.com/avatar.jpg", 1, "65",
            "1234567890", "SGD", "2023-05-01", null);

        jwtPayload = new JWTPayload(1, "test", "https://example.com/avatar.jpg", "test@u.nus.edu", "SGD");

        account = new Account(1, "test@u.nus.edu", "test", "passwordHash", "passwordSalt", "https://example.com/avatar.jpg", 1, "65", "1234567890", "SGD", "2023-05-01", null);

        uuid = UUID.randomUUID();
    }

    @Test
    public void registerValidRequest() throws Exception {
        when(accountService.registerService(any(RegisterReq.class))).thenReturn(ResponseEntity.status(HttpStatus.CREATED)
            .header("Set-Cookie", "access_token=").body(resAccount));

        mockMvc.perform(post("/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":\"" + uuid + "\",\"password\":\"password\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("test@u.nus.edu"))
            .andExpect(jsonPath("$.nickname").value("test"))
            .andExpect(jsonPath("$.avatarUrl").value("https://example.com/avatar.jpg"))
            .andExpect(jsonPath("$.departmentId").value(1))
            .andExpect(jsonPath("$.phoneCode").value("65"))
            .andExpect(jsonPath("$.phoneNumber").value("1234567890"))
            .andExpect(jsonPath("$.preferredCurrency").value("SGD"))
            .andExpect(jsonPath("$.createdAt").value("2023-05-01"))
            .andExpect(jsonPath("$.deletedAt").isEmpty())
            .andExpect(header().string("Set-Cookie", "access_token="));

        verify(accountService, times(1)).registerService(any(RegisterReq.class));
    }

    @Test
    public void registerInvalidRequest() throws Exception {
        mockMvc.perform(post("/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"invalid\",\"password\":\"\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));

        verify(accountService, never()).registerService(any(RegisterReq.class));
    }

    @Test
    public void registerRegisteredEmail() throws Exception {
        when(accountService.registerService(any(RegisterReq.class))).thenReturn(ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg)));

        when(accountDao.getAccountByEmail(anyString())).thenReturn(account);

        mockMvc.perform(post("/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":\"" + uuid + "\",\"password\":\"password\"}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg));

        verify(accountService, times(1)).registerService(any(RegisterReq.class));
    }

    @Test
    public void deleteAccountValidToken() throws Exception {
        when(accountService.deleteAccountService(anyInt())).thenReturn(ResponseEntity.status(HttpStatus.NO_CONTENT)
            .header("Set-Cookie", "access_token=").build());

        when(accountDao.getAccountById(anyInt())).thenReturn(account);

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(delete("/accounts/1")
                    .cookie(new Cookie("access_token", "ValidToken")))
                .andExpect(status().isNoContent())
                .andExpect(header().string("Set-Cookie", "access_token="));


            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(1)).deleteAccountService(anyInt());
        }
    }

    @Test
    public void deleteAccountNoToken() throws Exception {
        mockMvc.perform(delete("/accounts/1"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));

        verify(accountService, never()).deleteAccountService(anyInt());
    }

    @Test
    public void deleteAccountInvalidToken() throws Exception {
        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(false);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(null);

            // Perform the mock request
            mockMvc.perform(delete("/accounts/1")
                    .cookie(new Cookie("access_token", "ValidToken")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
    }

    @Test
    public void deleteAccountConflictedId() throws Exception {

        when(accountDao.getAccountById(anyInt())).thenReturn(account);

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(delete("/accounts/2")
                    .cookie(new Cookie("access_token", "ValidToken")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.ACCESS_FORBIDDEN.ErrorMsg));


            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(0)).deleteAccountService(anyInt());
        }
    }

    @Test
    public void updateProfileValidRequest() throws Exception {
        // Mock the updateProfileService to return a valid ResponseEntity with the resAccount object
        when(accountService.updateProfileService(any(UpdateProfileReq.class), anyInt()))
            .thenReturn(ResponseEntity.ok().body(resAccount));

        when(accountDao.getAccountById(anyInt())).thenReturn(account);

        // Mock static methods in JwtTokenManager using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            // Mock token validation to return true
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);

            // Mock token decoding to return a valid payload (mocking jwtPayload)
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);



            // Perform the mock request, ensuring a valid token is passed in the Cookie header
            mockMvc.perform(patch("/accounts/1")
                    // Use correct Cookie header format: "access_token=ValidToken"
                    .cookie(new Cookie("access_token", "ValidToken"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
                .andExpect(status().isOk())  // Expecting 200 OK response
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("test@u.nus.edu"))
                .andExpect(jsonPath("$.nickname").value("test"))
                .andExpect(jsonPath("$.avatarUrl").value("https://example.com/avatar.jpg"))
                .andExpect(jsonPath("$.departmentId").value(1))
                .andExpect(jsonPath("$.phoneCode").value("65"))
                .andExpect(jsonPath("$.phoneNumber").value("1234567890"))
                .andExpect(jsonPath("$.preferredCurrency").value("SGD"))
                .andExpect(jsonPath("$.createdAt").value("2023-05-01"))
                .andExpect(jsonPath("$.deletedAt").isEmpty());

            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(1)).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }
    }

    @Test
    public void updateProfileInvalidRequest() throws Exception {
        when(accountDao.getAccountById(anyInt())).thenReturn(account);

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(patch("/accounts/1")
                    .cookie(new Cookie("access_token", "ValidToken"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"1\",\"email\":\"Invalid Email\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));

            verify(accountService, never()).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }
    }

    @Test
    public void updateProfileAccountNotFound() throws Exception {
        when(accountService.updateProfileService(any(UpdateProfileReq.class), anyInt())).thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg)));

        when(accountDao.getAccountById(anyInt())).thenReturn(null);

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(patch("/accounts/2")
                    .cookie(new Cookie("access_token", "ValidToken"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));

            verify(accountService, times(0)).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }
    }

    @Test
    public void updateProfileInvalidToken() throws Exception {
        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(false);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(patch("/accounts/1")
                    .cookie(new Cookie("access_token", "ValidToken"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));

            verify(accountService, never()).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }
    }

    @Test
    public void updateProfileNoToken() throws Exception {
        mockMvc.perform(patch("/accounts/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));

        verify(accountService, never()).updateProfileService(any(UpdateProfileReq.class), anyInt());

    }
    @Test
    public void updateProfileEmailAlreadyRegistered() throws Exception {
        when(accountService.updateProfileService(any(UpdateProfileReq.class), anyInt())).thenReturn(ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg)));

        when(accountDao.getAccountById(anyInt())).thenReturn(account);

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(patch("/accounts/1")
                    .cookie(new Cookie("access_token", "ValidToken"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg));

            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(1)).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }

    }

    @Test
    public void updateProfileConflictId() throws Exception {
        when(accountService.updateProfileService(any(UpdateProfileReq.class), anyInt())).thenReturn(ResponseEntity.ok().body(resAccount));

        when(accountDao.getAccountById(anyInt())).thenReturn(account);

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(patch("/accounts/2")
                    .cookie(new Cookie("access_token", "ValidToken"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.ACCESS_FORBIDDEN.ErrorMsg));

            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.never()).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }

    }

    @Test
    public void getSpecificAccountValidId() throws Exception {
        when(accountService.getAccountService(anyInt())).thenReturn(ResponseEntity.ok().body(resAccount));

        mockMvc.perform(get("/accounts/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("test@u.nus.edu"))
            .andExpect(jsonPath("$.nickname").value("test"))
            .andExpect(jsonPath("$.avatarUrl").value("https://example.com/avatar.jpg"))
            .andExpect(jsonPath("$.departmentId").value(1))
            .andExpect(jsonPath("$.phoneCode").value("65"))
            .andExpect(jsonPath("$.phoneNumber").value("1234567890"))
            .andExpect(jsonPath("$.preferredCurrency").value("SGD"))
            .andExpect(jsonPath("$.createdAt").value("2023-05-01"))
            .andExpect(jsonPath("$.deletedAt").isEmpty())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));


        verify(accountService, times(1)).getAccountService(anyInt());
    }


}
