package edu.nus.market;

import edu.nus.market.controller.WishlistController;
import edu.nus.market.pojo.ErrorMsgEnum;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.service.WishlistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class WishlistControllerTest {

    @Mock
    private JwtTokenManager jwtTokenManager;

    @Mock
    private WishlistService wishlistService;

    @InjectMocks
    private WishlistController wishlistController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new WishlistController()).build();
    }

    @Test
    public void getFavorlist_NoToken_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/wishlist"))
            .andExpect(status().isUnauthorized())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.error").value(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
    }

    @Test
    public void getFavorlist_InvalidToken_ShouldReturnUnauthorized() throws Exception {
        String invalidToken = "invalidToken";

        try (MockedStatic<JwtTokenManager> mockedJwtTokenManager = mockStatic(JwtTokenManager.class)) {
            when(JwtTokenManager.validateCookie(anyString())).thenReturn(false);
            when(JwtTokenManager.decodeCookie(anyString())).thenReturn(1);

            mockMvc.perform(get("/wishlist").header("Cookie", invalidToken))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));


        }
    }

    @Test
    public void getFavorlist_ValidToken_ShouldReturnFavorlist() throws Exception {
        String validToken = "validToken";
        int userId = 1;

        try (MockedStatic<JwtTokenManager> mockedJwtTokenManager = mockStatic(JwtTokenManager.class)) {
            when(JwtTokenManager.validateCookie(anyString())).thenReturn(true);
            when(JwtTokenManager.decodeCookie(anyString())).thenReturn(userId);

            mockMvc.perform(get("/wishlist").header("Cookie", validToken))
                .andExpect(status().isOk());

        }
    }
}
