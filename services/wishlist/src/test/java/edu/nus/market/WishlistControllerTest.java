package edu.nus.market;

import edu.nus.market.controller.WishlistController;
import edu.nus.market.converter.ConvertDateToISO;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import edu.nus.market.pojo.ResEntity.JWTPayload;
import edu.nus.market.pojo.*;
import edu.nus.market.security.CookieManager;
import edu.nus.market.security.JwtTokenManager;
import edu.nus.market.service.WishlistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.MapBindingResult;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

class WishlistControllerTest {

    @Mock
    private WishlistService wishlistService;

    @InjectMocks
    private WishlistController wishlistController;
    @InjectMocks
    private CookieManager cookieManager;


    private List<Like> mockLikes;
    String cookie;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        prepareTestData();
        JwtTokenManager.setSecretKey(JwtTokenManager.generateSecretKey()); // 设置静态密钥
        generateValidToken();
    }

    private void prepareTestData() {
        mockLikes = new ArrayList<>();

        SingleLike singleLike = new SingleLike();
        singleLike.setItemId("item001");
        singleLike.setName("iPhone 12");
        singleLike.setStatus(1);
        singleLike.setPrice(999.99);
        singleLike.setPhotoUrls(Arrays.asList("http://example.com/iphone12_front.jpg"));
        singleLike.setSeller(new Seller(1, "John's Store", "http://example.com/avatar.jpg"));
        singleLike.setWantedAt(new Date());

        mockLikes.add(singleLike);
    }

    private void generateValidToken() {
        JWTPayload jwtPayload = new JWTPayload(
            1,  "testuser", "http://example.com/avatar.jpg","example.u.nus.edu");
        cookie = JwtTokenManager.generateAccessToken(jwtPayload);
    }

    @Test
    void testGetWishlist_Unauthorized() {
        ResponseEntity<Object> response = wishlistController.getWishlist(1, "", ConvertDateToISO.convert(new Date()));

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void testAddLike_Conflict() {
        AddLikeReq req = new AddLikeReq();
        req.setStatus(1);
        req.setItemId("item001");
        req.setName("iPhone 13");
        req.setPrice(999.99);
        req.setPhotoUrls(Arrays.asList("http://example.com/iphone12_front.jpg"));
        req.setDiscount(0.0);
        req.setSeller(new Seller(1, "John's Store", "http://example.com/avatar.jpg"));
        req.setType("SINGLE");

        BindingResult bindingResult = new MapBindingResult(new HashMap<>(), "req");

        when(wishlistService.addLikeService(any(AddLikeReq.class)))
            .thenReturn(ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorMsg(ErrorMsgEnum.WISHLIST_CONFLICT.ErrorMsg)));

        ResponseEntity<Object> response = wishlistController.addLike(1, "item002", req, bindingResult, cookie);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
    @Test
    void testAddLike_Unauthorized() {
        AddLikeReq req = new AddLikeReq();

        ResponseEntity<Object> response = wishlistController.addLike(1, "item003", req, null, "");

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }


    @Test
    void testGetWishlist_Success() {
        when(wishlistService.getWishlistService(anyInt(),any())).thenReturn(ResponseEntity.ok(mockLikes));

        ResponseEntity<Object> response = wishlistController.getWishlist(1, cookie, ConvertDateToISO.convert(new Date()));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockLikes, response.getBody());
    }

    @Test
    void testAddLike_Success() {
        AddLikeReq req = new AddLikeReq();
        req.setStatus(1);
        req.setItemId("item001");
        req.setName("iPhone 13");
        req.setPrice(999.99);
        req.setPhotoUrls(Arrays.asList("http://example.com/iphone12_front.jpg"));
        req.setSeller(new Seller(1, "John's Store", "http://example.com/avatar.jpg"));
        req.setType("SINGLE");

        BindingResult bindingResult = new MapBindingResult(new HashMap<>(), "req");

        when(wishlistService.addLikeService(any(AddLikeReq.class))).thenReturn(ResponseEntity.ok().build());

        ResponseEntity<Object> response = wishlistController.addLike(1, "item001", req, bindingResult, cookie);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteLike_Success() {
        // Arrange
        when(wishlistService.deleteLikeService(anyInt(), anyString())).thenReturn(ResponseEntity.ok().build());

        // Act
        ResponseEntity<Object> response = wishlistController.deleteLike(1, "item001", cookie);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteLike_Unauthorized() {
        // Act
        ResponseEntity<Object> response = wishlistController.deleteLike(1, "item001", "");

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg), response.getBody());
    }

    @Test
    void testGetItemLikeInfo_Success() {
        // Arrange
        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("count", 1);
        mockResponse.put("favoriteDate", new Date());

        when(wishlistService.getItemLikeInfoService(anyString(), anyInt())).thenReturn(ResponseEntity.ok(mockResponse));

        // Act
        ResponseEntity<Object> response = wishlistController.getItemLikeInfo("item001", cookie);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockResponse, response.getBody());
    }

    @Test
    void testGetItemLikeInfo_Unauthorized() {
        // Act
        ResponseEntity<Object> response = wishlistController.getItemLikeInfo("item001", "");

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.NOT_LOGGED_IN.ErrorMsg), response.getBody());
    }
}
