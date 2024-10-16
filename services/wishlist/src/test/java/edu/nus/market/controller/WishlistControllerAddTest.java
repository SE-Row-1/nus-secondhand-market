//package edu.nus.market.controller;
//
//import java.util.*;
//import java.math.*;
//
//import edu.nus.market.pojo.AddLikeReq;
//import edu.nus.market.pojo.ErrorMsg;
//import edu.nus.market.pojo.ErrorMsgEnum;
//import edu.nus.market.pojo.ResEntity.ResAccount;
//import edu.nus.market.security.JwtTokenManager;
//import edu.nus.market.service.WishlistService;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//
//@ExtendWith(MockitoExtension.class)
//public class WishlistControllerAddTest {
//
//    private MockMvc mockMvc;
//
//    @Mock
//    private WishlistService wishlistService;
//
//    @InjectMocks
//    private WishlistController wishlistController;
//
//    @BeforeEach
//    public void setup() {
//        mockMvc = MockMvcBuilders.standaloneSetup(wishlistController).build();
//    }
//
//    @Test
//    public void addLike_TokenNotProvided_ReturnsUnauthorized() throws Exception {
//        AddLikeReq req = new AddLikeReq("type", 1, "id", "itemName", 1, 10.0, new String[]{"photoUrl"}, null, 0.0, null);
//
//        mockMvc.perform(post("/wishlist/1/items/id")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"type\":\"type\",\"userId\":1,\"itemId\":\"id\",\"itemName\":\"itemName\",\"itemStatus\":1,\"price\":10.0,\"photoUrls\":[\"photoUrl\"]}"))
//            .andExpect(status().isUnauthorized())
//            .andExpect(jsonPath("$.ErrorMsg").value(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg));
//    }
//
//    @Test
//    public void addLike_TokenInvalid_ReturnsUnauthorized() throws Exception {
//        AddLikeReq req = new AddLikeReq("type", 1, "id", "itemName", 1, 10.0, new String[]{"photoUrl"}, null, 0.0, null);
//
//        mockStatic(JwtTokenManager.class);
//        when(JwtTokenManager.validateCookie(anyString())).thenReturn(false);
//
//        mockMvc.perform(post("/wishlist/1/items/id")
//                .header("Cookie", "token=invalidToken")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"type\":\"type\",\"userId\":1,\"itemId\":\"id\",\"itemName\":\"itemName\",\"itemStatus\":1,\"price\":10.0,\"photoUrls\":[\"photoUrl\"]}"))
//            .andExpect(status().isUnauthorized())
//            .andExpect(jsonPath("$.ErrorMsg").value(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
//
//    }
//
//    @Test
//    public void addLike_BindingResultHasErrors_ReturnsBadRequest() throws Exception {
//        AddLikeReq req = new AddLikeReq(null, 1, "id", "itemName", 1, 10.0, new String[]{"photoUrl"}, null, 0.0, null);
//
//        mockStatic(JwtTokenManager.class);
//        when(JwtTokenManager.validateCookie(anyString())).thenReturn(true);
//        when(JwtTokenManager.decodeCookie(anyString())).thenReturn(new ResAccount(1, "email", "nickname", "avatarUrl", 1, "phoneCode", "phoneNumber", "currency", "createdAt", "deletedAt"));
//
//        mockMvc.perform(post("/wishlist/1/items/id")
//                .header("Cookie", "token=validToken")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"type\":null,\"userId\":1,\"itemId\":\"id\",\"itemName\":\"itemName\",\"itemStatus\":1,\"price\":10.0,\"photoUrls\":[\"photoUrl\"]}"))
//            .andExpect(status().isBadRequest())
//            .andExpect(jsonPath("$.ErrorMsg").value(ErrorMsgEnum.INVALID_DATA_FORMAT.ErrorMsg));
//
//    }
//
//    @Test
//    public void addLike_UserIdMismatch_ReturnsUnauthorized() throws Exception {
//        AddLikeReq req = new AddLikeReq("type", 1, "id", "itemName", 1, 10.0, new String[]{"photoUrl"}, null, 0.0, null);
//
//        mockStatic(JwtTokenManager.class);
//        when(JwtTokenManager.validateCookie(anyString())).thenReturn(true);
//        when(JwtTokenManager.decodeCookie(anyString())).thenReturn(new ResAccount(2, "email", "nickname", "avatarUrl", 1, "phoneCode", "phoneNumber", "currency", "createdAt", "deletedAt"));
//
//        mockMvc.perform(post("/wishlist/1/items/id")
//                .header("Cookie", "token=validToken")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"type\":\"type\",\"userId\":1,\"itemId\":\"id\",\"itemName\":\"itemName\",\"itemStatus\":1,\"price\":10.0,\"photoUrls\":[\"photoUrl\"]}"))
//            .andExpect(status().isUnauthorized())
//            .andExpect(jsonPath("$.ErrorMsg").value(ErrorMsgEnum.UNAUTHORIZED_ACCESS.ErrorMsg));
//
//    }
//
//    @Test
//    public void addLike_ItemIdMismatch_ReturnsBadRequest() throws Exception {
//        AddLikeReq req = new AddLikeReq("type", 1, "differentId", "itemName", 1, 10.0, new String[]{"photoUrl"}, null, 0.0, null);
//
//        mockStatic(JwtTokenManager.class);
//        when(JwtTokenManager.validateCookie(anyString())).thenReturn(true);
//        when(JwtTokenManager.decodeCookie(anyString())).thenReturn(new ResAccount(1, "email", "nickname", "avatarUrl", 1, "phoneCode", "phoneNumber", "currency", "createdAt", "deletedAt"));
//
//        mockMvc.perform(post("/wishlist/1/items/id")
//                .header("Cookie", "token=validToken")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"type\":\"type\",\"userId\":1,\"itemId\":\"differentId\",\"itemName\":\"itemName\",\"itemStatus\":1,\"price\":10.0,\"photoUrls\":[\"photoUrl\"]}"))
//            .andExpect(status().isBadRequest())
//            .andExpect(jsonPath("$.ErrorMsg").value(ErrorMsgEnum.INVALID_DATA.ErrorMsg));
//
//    }
//
//    @Test
//    public void addLike_ValidRequest_ReturnsSuccess() throws Exception {
//        AddLikeReq req = new AddLikeReq("type", 1, "id", "itemName", 1, 10.0, new String[]{"photoUrl"}, null, 0.0, null);
//
//        mockStatic(JwtTokenManager.class);
//        when(JwtTokenManager.validateCookie(anyString())).thenReturn(true);
//        when(JwtTokenManager.decodeCookie(anyString())).thenReturn(new ResAccount(1, "email", "nickname", "avatarUrl", 1, "phoneCode", "phoneNumber", "currency", "createdAt", "deletedAt"));
//
//        when(wishlistService.addLikeService(any(AddLikeReq.class))).thenReturn(ResponseEntity.ok().build());
//
//        mockMvc.perform(post("/wishlist/1/items/id")
//                .header("Cookie", "token=validToken")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{\"type\":\"type\",\"userId\":1,\"itemId\":\"id\",\"itemName\":\"itemName\",\"itemStatus\":1,\"price\":10.0,\"photoUrls\":[\"photoUrl\"]}"))
//            .andExpect(status().isOk());
//
//    }
//}
