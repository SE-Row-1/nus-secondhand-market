package edu.nus.market.ControllerTests;

import edu.nus.market.controller.AccountController;
import edu.nus.market.pojo.ErrorMsg;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.pojo.ReqEntity.*;
import edu.nus.market.pojo.ResEntity.ResAccount;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.service.AccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AccountControllerTest {

    private MockMvc mockMvc;

    private ResAccount resAccount;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private AccountController accountController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(accountController).build();

        resAccount = new ResAccount(1, "test@u.nus.edu", "test",
            "https://example.com/avatar.jpg", 1, "65",
            "1234567890", "SGD", "2023-05-01", null);
    }

    @Test
    public void registerValidRequest() throws Exception {
        when(accountService.registerService(any(RegisterReq.class))).thenReturn(ResponseEntity.status(HttpStatus.CREATED)
            .header("Set-Cookie", "access_token=").body(resAccount));

        mockMvc.perform(post("/auth/me")
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

        verify(accountService, times(1)).registerService(any(RegisterReq.class));
    }

    @Test
    public void registerInvalidRequest() throws Exception {
        mockMvc.perform(post("/auth/me")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"invalid\",\"password\":\"\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Invalid data format."));

        verify(accountService, never()).registerService(any(RegisterReq.class));
    }

    @Test
    public void registerRegisteredEmail() throws Exception {
        when(accountService.registerService(any(RegisterReq.class))).thenReturn(ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg)));

        mockMvc.perform(post("/auth/me")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@u.nus.edu\",\"password\":\"password\"}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error").value("This email is already registered."));

        verify(accountService, times(1)).registerService(any(RegisterReq.class));
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
            .andExpect(jsonPath("$.error").value("Invalid data format."));

        verify(accountService, never()).loginService(any(LoginReq.class));
    }

    @Test
    public void loginAccountNotRegistered() throws Exception {
        when(accountService.loginService(any(LoginReq.class))).thenReturn(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg)));

        mockMvc.perform(post("/auth/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@u.nus.edu\",\"password\":\"password\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("This account does not exist."));

        verify(accountService, times(1)).loginService(any(LoginReq.class));
    }

    @Test
    public void loginAccountWrongPassword() throws Exception {
        when(accountService.loginService(any(LoginReq.class))).thenReturn(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMsg(ErrorMsgEnum.WRONG_PASSWORD.ErrorMsg)));

        mockMvc.perform(post("/auth/token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@u.nus.edu\",\"password\":\"password\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Wrong password. Please try again."));

        verify(accountService, times(1)).loginService(any(LoginReq.class));
    }

    @Test
    public void getAccountValidToken() throws Exception {
        when(accountService.getAccountService(anyInt())).thenReturn(ResponseEntity.ok().body(resAccount));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(get("/auth/me")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Cookie", "Valid Token"))
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
                    .header("Cookie", "Invalid Token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Token validation failed."));
        }
    }

    @Test
    public void getAccountNoToken() throws Exception {
        mockMvc.perform(get("/auth/me"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Please log in first."));
    }

    @Test
    public void logoutValidToken() throws Exception {
        when(accountService.logoutService()).thenReturn(ResponseEntity.noContent()
            .header("Set-Cookie", "access_token=").build());

        mockMvc.perform(delete("/auth/token")
                .header("Cookie", "validToken"))
            .andExpect(status().isNoContent())
                .andExpect(header().string("Set-Cookie", "access_token="));

        verify(accountService, times(1)).logoutService();
    }

    @Test
    public void deleteAccountValidToken() throws Exception {
        when(accountService.deleteAccountService(anyInt())).thenReturn(ResponseEntity.status(HttpStatus.NO_CONTENT)
            .header("Set-Cookie", "access_token=").build());

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(delete("/auth/me")
                    .header("Cookie", "Valid Token"))
                .andExpect(status().isNoContent())
                .andExpect(header().string("Set-Cookie", "access_token="));


            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(1)).deleteAccountService(anyInt());
        }
    }

    @Test
    public void deleteAccountNoToken() throws Exception {
        mockMvc.perform(delete("/auth/me"))
            .andExpect(status().isUnauthorized());

        verify(accountService, never()).deleteAccountService(anyInt());
    }

    @Test
    public void deleteAccountInvalidToken() throws Exception {
        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(false);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(null);

            // Perform the mock request
            mockMvc.perform(delete("/auth/me")
                    .header("Cookie", "Invalid Token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Token validation failed."));
        }
    }

    @Test
    public void deleteAccountNotFound() throws Exception {
        when(accountService.deleteAccountService(anyInt())).thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg)));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(delete("/auth/me")
                    .header("Cookie", "Valid Token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("This account does not exist."));


            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(1)).deleteAccountService(anyInt());
        }
    }

    @Test
    public void resetPasswordValidRequest() throws Exception {
        when(accountService.forgetPasswordService(any(ForgetPasswordReq.class))).thenReturn(ResponseEntity.ok().build());

        mockMvc.perform(patch("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@u.nus.edu\", \"newPassword\":\"new password\"}"))
            .andExpect(status().isOk());

        verify(accountService, times(1)).forgetPasswordService(any(ForgetPasswordReq.class));
    }

    @Test
    public void resetPasswordInvalidRequest() throws Exception {
        mockMvc.perform(patch("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"invalid\"}"))
            .andExpect(status().isBadRequest());

        verify(accountService, never()).forgetPasswordService(any(ForgetPasswordReq.class));
    }

    @Test
    public void resetPasswordAccountNotFound() throws Exception {
        when(accountService.forgetPasswordService(any(ForgetPasswordReq.class))).thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg)));

        mockMvc.perform(patch("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@u.nus.edu\", \"newPassword\":\"new password\"}"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("This account does not exist."));

        verify(accountService, times(1)).forgetPasswordService(any(ForgetPasswordReq.class));
    }

    @Test
    public void updateAccountPswValidRequest() throws Exception {
        when(accountService.updatePasswordService(any(UpdPswReq.class), anyInt())).thenReturn(ResponseEntity.ok().body(resAccount));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(put("/auth/me/password")
                    .header("Cookie", "Valid Token")
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
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(put("/auth/me/password")
                    .header("Cookie", "validToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"oldPassword\":\"\",\"newPassword\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid data format."));

            verify(accountService, never()).updatePasswordService(any(UpdPswReq.class), anyInt());
        }
    }

    @Test
    public void updateAccountPswAccountNotFound() throws Exception {
        when(accountService.updatePasswordService(any(UpdPswReq.class), anyInt())).thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg)));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(put("/auth/me/password")
                    .header("Cookie", "validToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"oldPassword\":\"oldPassword\",\"newPassword\":\"newPassword\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("This account does not exist."));

            verify(accountService, times(1)).updatePasswordService(any(UpdPswReq.class), anyInt());
        }
    }

    @Test
    public void updateAccountPswInvalidToken() throws Exception {
        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(false);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(put("/auth/me/password")
                    .header("Cookie", "validToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"oldPassword\":\"\",\"newPassword\":\"\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Token validation failed."));

            verify(accountService, never()).updatePasswordService(any(UpdPswReq.class), anyInt());
        }
    }

    @Test
    public void updateAccountPswNoToken() throws Exception {
        mockMvc.perform(put("/auth/me/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"oldPassword\":\"\",\"newPassword\":\"\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Please log in first."));

        verify(accountService, never()).updatePasswordService(any(UpdPswReq.class), anyInt());

    }

    @Test
    public void updateProfileValidRequest() throws Exception {
        when(accountService.updateProfileService(any(UpdateProfileReq.class), anyInt())).thenReturn(ResponseEntity.ok().body(resAccount));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(patch("/auth/me")
                    .header("Cookie", "Valid Token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
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
            Mockito.verify(accountService, Mockito.times(1)).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }

    }

    @Test
    public void updateProfileInvalidRequest() throws Exception {
        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(put("/auth/me/password")
                    .header("Cookie", "validToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"Invalid Email\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid data format."));

            verify(accountService, never()).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }
    }

    @Test
    public void updateProfileAccountNotFound() throws Exception {
        when(accountService.updateProfileService(any(UpdateProfileReq.class), anyInt())).thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorMsg(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg)));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(patch("/auth/me")
                    .header("Cookie", "validToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("This account does not exist."));

            verify(accountService, times(1)).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }
    }

    @Test
    public void updateProfileInvalidToken() throws Exception {
        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(false);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(patch("/auth/me")
                    .header("Cookie", "validToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Token validation failed."));

            verify(accountService, never()).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }
    }

    @Test
    public void updateProfileNoToken() throws Exception {
        mockMvc.perform(patch("/auth/me")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Please log in first."));

        verify(accountService, never()).updateProfileService(any(UpdateProfileReq.class), anyInt());

    }

    @Test
    public void updateProfileEmailAlreadyRegistered() throws Exception {
        when(accountService.updateProfileService(any(UpdateProfileReq.class), anyInt())).thenReturn(ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMsg(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg)));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(patch("/auth/me")
                    .header("Cookie", "Valid Token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("This email is already registered."));

            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(1)).updateProfileService(any(UpdateProfileReq.class), anyInt());
        }

    }

    @Test
    public void getSpecificAccountValidId() throws Exception {
        when(accountService.getAccountService(anyInt())).thenReturn(ResponseEntity.ok().build());

        mockMvc.perform(get("/auth/account/1"))
            .andExpect(status().isOk());

        verify(accountService, times(1)).getAccountService(anyInt());
    }

    @Test
    public void checkHealth_ShouldReturnOk() throws Exception {
        mockMvc.perform(get("/auth/healthz"))
            .andExpect(status().isOk())
            .andExpect(content().string("ok"));
    }
}
