package edu.nus.market.ControllerTests;

import edu.nus.market.controller.AccountController;
import edu.nus.market.controller.AuthController;
import edu.nus.market.dao.AccountDao;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.ForgetPasswordReq;
import edu.nus.market.pojo.ReqEntity.LoginReq;
import edu.nus.market.pojo.ReqEntity.UpdPswReq;
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

public class AuthControllerTest {

    private MockMvc mockMvc;

    private ResAccount resAccount;

    private JWTPayload jwtPayload;

    private UUID uuid = UUID.randomUUID();

    private Account account;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private AuthController authController;

    @Mock
    private AccountDao accountDao;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();

        resAccount = new ResAccount(1, "test@u.nus.edu", "test",
            "https://example.com/avatar.jpg", 1, "65",
            "1234567890", "SGD", "2023-05-01", null);

        jwtPayload = new JWTPayload(1, "test", "https://example.com/avatar.jpg", "test@u.nus.edu", "SGD");

        account = new Account(1, "test@u.nus.edu", "test", "password", "salt", "https://example.com/avatar.jpg", 1, "65", "1234567890", "SGD", "2023-05-01", null);
    }

    @Test
    public void loginValidRequest() throws Exception {
        when(accountService.loginService(any(LoginReq.class))).thenReturn(ResponseEntity.status(HttpStatus.CREATED)
            .header("Set-Cookie", "access_token=").body(resAccount));

        mockMvc.perform(post("/auth/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@u.nus.edu\",\"password\":\"password\"}"))
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

        verify(accountService, times(1)).loginService(any(LoginReq.class));
    }

    @Test
    public void loginInvalidRequest() throws Exception {
        mockMvc.perform(post("/auth/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"invalid\",\"password\":\"password\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));

        verify(accountService, never()).loginService(any(LoginReq.class));
    }

    @Test
    public void loginAccountNotRegistered() throws Exception {
        when(accountService.loginService(any(LoginReq.class))).thenReturn(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg)));

        mockMvc.perform(post("/auth/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@u.nus.edu\",\"password\":\"password\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));

        verify(accountService, times(1)).loginService(any(LoginReq.class));
    }

    @Test
    public void loginAccountWrongPassword() throws Exception {
        when(accountService.loginService(any(LoginReq.class))).thenReturn(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.WRONG_PASSWORD.ErrorMsg)));

        mockMvc.perform(post("/auth/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@u.nus.edu\",\"password\":\"password\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.WRONG_PASSWORD.ErrorMsg));

        verify(accountService, times(1)).loginService(any(LoginReq.class));
    }

    @Test
    public void getAccountValidToken() throws Exception {
        when(accountService.getAccountService(anyInt())).thenReturn(ResponseEntity.ok().body(resAccount));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(get("/auth/me")
                    .contentType(MediaType.APPLICATION_JSON)
                    .cookie(new Cookie("access_token", "ValidToken")))
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


            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(1)).getAccountService(anyInt());
        }
    }

    @Test
    public void getAccountInvalidToken() throws Exception {
        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(false);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(null);

            // Perform the mock request
            mockMvc.perform(get("/auth/me")
                    .cookie(new Cookie("access_token", "ValidToken")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
        }
    }

    @Test
    public void getAccountNoToken() throws Exception {
        mockMvc.perform(get("/auth/me"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
    }

    @Test
    public void logoutValidToken() throws Exception {
        when(accountService.logoutService()).thenReturn(ResponseEntity.noContent()
            .header("Set-Cookie", "access_token=").build());

        mockMvc.perform(delete("/auth/token")
                .cookie(new Cookie("access_token", "ValidToken")))
            .andExpect(status().isNoContent())
            .andExpect(header().string("Set-Cookie", "access_token="));

        verify(accountService, times(1)).logoutService();
    }

    @Test
    public void resetPasswordValidRequest() throws Exception {
        when(accountService.forgetPasswordService(any(ForgetPasswordReq.class))).thenReturn(ResponseEntity.ok().build());

        mockMvc.perform(post("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":\"" + uuid + "\", \"newPassword\":\"new password\"}"))
            .andExpect(status().isOk());

        verify(accountService, times(1)).forgetPasswordService(any(ForgetPasswordReq.class));
    }

    @Test
    public void resetPasswordInvalidRequest() throws Exception {
        mockMvc.perform(post("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"invalid\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));

        verify(accountService, never()).forgetPasswordService(any(ForgetPasswordReq.class));
    }

    @Test
    public void resetPasswordAccountNotFound() throws Exception {
        when(accountService.forgetPasswordService(any(ForgetPasswordReq.class))).thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg)));

        mockMvc.perform(post("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":\"" + uuid + "\", \"newPassword\":\"new password\"}"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));

        verify(accountService, times(1)).forgetPasswordService(any(ForgetPasswordReq.class));
    }

    @Test
    public void updateAccountPswValidRequest() throws Exception {
        when(accountService.updatePasswordService(any(UpdPswReq.class), anyInt())).thenReturn(ResponseEntity.ok().body(resAccount));

        when(accountDao.getAccountById(anyInt())).thenReturn(account);

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(put("/auth/me/password")
                    .cookie(new Cookie("access_token", "ValidToken"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"oldPassword\":\"password\",\"newPassword\":\"newPassword\"}"))
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
                .andExpect(jsonPath("$.deletedAt").isEmpty());


            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(1)).updatePasswordService(any(UpdPswReq.class), anyInt());
        }
    }

    @Test
    public void updateAccountPswInvalidRequest() throws Exception {
        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(put("/auth/me/password")
                    .cookie(new Cookie("access_token", "ValidToken"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"oldPassword\":\"1\",\"newPassword\":\"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));

            verify(accountService, never()).updatePasswordService(any(UpdPswReq.class), anyInt());
        }
    }

    @Test
    public void updateAccountPswAccountNotFound() throws Exception {
        when(accountService.updatePasswordService(any(UpdPswReq.class), anyInt())).thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg)));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(put("/auth/me/password")
                    .cookie(new Cookie("access_token", "ValidToken"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"oldPassword\":\"oldPassword\",\"newPassword\":\"newPassword\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));

            verify(accountService, times(0)).updatePasswordService(any(UpdPswReq.class), anyInt());
        }
    }

    @Test
    public void updateAccountPswInvalidToken() throws Exception {
        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateToken(anyString())).thenReturn(false);
            mockedJwt.when(() -> JwtTokenManager.decodeAccessToken(anyString())).thenReturn(jwtPayload);

            // Perform the mock request
            mockMvc.perform(put("/auth/me/password")
                    .cookie(new Cookie("access_token", "ValidToken"))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"oldPassword\":\"12345678\",\"newPassword\":\"123456789\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));

            verify(accountService, never()).updatePasswordService(any(UpdPswReq.class), anyInt());
        }
    }

    @Test
    public void updateAccountPswNoToken() throws Exception {
        mockMvc.perform(put("/auth/me/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"oldPassword\":\"12345678\",\"newPassword\":\"123456789\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));

        verify(accountService, never()).updatePasswordService(any(UpdPswReq.class), anyInt());
    }

    @Test
    public void checkHealth_ShouldReturnOk() throws Exception {
        mockMvc.perform(get("/auth/healthz"))
            .andExpect(status().isOk())
            .andExpect(content().string("ok"));
    }
}

