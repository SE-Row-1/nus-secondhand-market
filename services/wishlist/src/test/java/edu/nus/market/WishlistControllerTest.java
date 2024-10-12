package edu.nus.market;

import edu.nus.market.controller.WishlistController;
import edu.nus.market.pojo.ResEntity.ResAccount;
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

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

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
        JwtTokenManager.setSecretKey("9lRZUYgnElr2PnI9K/yAxIyX+kR31vGRCuGFfRs5ZVE="); // 设置静态密钥
        generateValidToken();
    }

    private void prepareTestData() {
        mockLikes = new ArrayList<>();

        SingleLike singleLike = new SingleLike();
        singleLike.setItemId("item001");
        singleLike.setItemName("iPhone 12");
        singleLike.setItemStatus(1);
        singleLike.setPrice(999.99);
        singleLike.setPhotoUrls(new String[]{"http://example.com/iphone12_front.jpg"});
        singleLike.setSeller(new Seller("seller001", "John's Store", "http://example.com/avatar.jpg"));
        singleLike.setFavoriteDate(new Date());

        mockLikes.add(singleLike);
    }

    private void generateValidToken() {
        ResAccount resAccount = new ResAccount(
            1, "user@example.com", "testuser", "http://example.com/avatar.jpg",
            123, "+65", "12345678", "SGD", "2024-01-01", null
        );
        cookie = cookieManager.generateCookie(JwtTokenManager.generateAccessToken(resAccount)).toString();
    }

    @Test
    void testGetWishlist_Unauthorized() {
        ResponseEntity<Object> response = wishlistController.getWishlist(1, "");

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void testAddLike_Conflict() {
        AddLikeReq req = new AddLikeReq();
        req.setItemStatus(1);
        req.setItemId("item001");
        req.setItemName("iPhone 13");
        req.setPrice(999.99);
        req.setPhotoUrls(new String[]{"http://example.com/iphone13_front.jpg"});
        req.setDiscount(0.0);
        req.setSeller(new Seller("seller001", "John's Store", "http://example.com/avatar.jpg"));
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
        when(wishlistService.getWishlistService(anyInt())).thenReturn(ResponseEntity.ok(mockLikes));

        ResponseEntity<Object> response = wishlistController.getWishlist(1, cookie);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockLikes, response.getBody());
    }

    @Test
    void testAddLike_Success() {
        AddLikeReq req = new AddLikeReq();
        req.setItemStatus(1);
        req.setItemId("item001");
        req.setItemName("iPhone 13");
        req.setPrice(999.99);
        req.setPhotoUrls(new String[]{"http://example.com/iphone13_front.jpg"});
        req.setDiscount(0.0);
        req.setSeller(new Seller("seller001", "John's Store", "http://example.com/avatar.jpg"));
        req.setType("SINGLE");

        BindingResult bindingResult = new MapBindingResult(new HashMap<>(), "req");

        when(wishlistService.addLikeService(any(AddLikeReq.class))).thenReturn(ResponseEntity.ok().build());

        ResponseEntity<Object> response = wishlistController.addLike(1, "item001", req, bindingResult, cookie);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
