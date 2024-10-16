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

        mockMvc.perform(post("/accounts")
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

        mockMvc.perform(post("/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@u.nus.edu\",\"password\":\"password\"}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.REGISTERED_EMAIL.ErrorMsg));

        verify(accountService, times(1)).registerService(any(RegisterReq.class));
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
            mockMvc.perform(delete("/accounts/1")
                    .header("Cookie", "Valid Token"))
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
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(false);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(null);

            // Perform the mock request
            mockMvc.perform(delete("/accounts/1")
                    .header("Cookie", "Invalid Token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
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
            mockMvc.perform(delete("/accounts/1")
                    .header("Cookie", "Valid Token"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));


            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.times(1)).deleteAccountService(anyInt());
        }
    }

    @Test
    public void deleteAccountConflictId() throws Exception {
        when(accountService.deleteAccountService(anyInt())).thenReturn(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .header("Set-Cookie", "access_token=").build());

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(delete("/accounts/2")
                    .header("Cookie", "Valid Token"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.ACCESS_FORBIDDEN.ErrorMsg));

            // Verify that the mocked accountService method was called
            Mockito.verify(accountService, Mockito.never()).deleteAccountService(anyInt());
        }
    }

    @Test
    public void updateProfileValidRequest() throws Exception {
        when(accountService.updateProfileService(any(UpdateProfileReq.class), anyInt())).thenReturn(ResponseEntity.ok().body(resAccount));

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(patch("/accounts/1")
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
            mockMvc.perform(patch("/accounts/1")
                    .header("Cookie", "validToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"Invalid Email\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));

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
            mockMvc.perform(patch("/accounts/1")
                    .header("Cookie", "validToken")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"nickname\":\"nickname\",\"email\":\"example@u.nus.edu\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.ACCOUNT_NOT_FOUND.ErrorMsg));

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
            mockMvc.perform(patch("/accounts/1")
                    .header("Cookie", "validToken")
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

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(patch("/accounts/1")
                    .header("Cookie", "Valid Token")
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

        // Mock static method using mockStatic from Mockito-inline
        try (MockedStatic<JwtTokenManager> mockedJwt = mockStatic(JwtTokenManager.class)) {
            mockedJwt.when(() -> JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            mockedJwt.when(() -> JwtTokenManager.decodeCookie(anyString())).thenReturn(resAccount);

            // Perform the mock request
            mockMvc.perform(patch("/accounts/2")
                .header("Cookie", "Valid Token")
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
