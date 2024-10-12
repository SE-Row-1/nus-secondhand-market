package edu.nus.market;

import edu.nus.market.dao.WishlistDao;
import edu.nus.market.pojo.*;
import edu.nus.market.service.WishlistServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

class WishlistServiceImplTest {

    @Mock
    private WishlistDao wishlistDao;

    @InjectMocks
    private WishlistServiceImpl wishlistService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetWishlistService_Success() {
        // Arrange
        List<Like> mockLikes = List.of(new SingleLike());
        when(wishlistDao.findByUserId(anyInt())).thenReturn(mockLikes);

        // Act
        ResponseEntity<Object> response = wishlistService.getWishlistService(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockLikes, response.getBody());
    }

    @Test
    void testGetWishlistService_EmptyList() {
        // Arrange
        when(wishlistDao.findByUserId(anyInt())).thenReturn(List.of());

        // Act
        ResponseEntity<Object> response = wishlistService.getWishlistService(1);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, ((List<?>) response.getBody()).size());
    }

    @Test
    void testAddLikeService_Success() {
        // Arrange
        AddLikeReq req = new AddLikeReq();
        req.setItemStatus(1);
        req.setItemId("item001");
        req.setItemName("iPhone 13");
        req.setPrice(999.99);
        req.setPhotoUrls(new String[]{"http://example.com/iphone13_front.jpg"});
        req.setDiscount(0.0);
        req.setSeller(new Seller("seller001", "John's Store", "http://example.com/avatar.jpg"));
        req.setType("SINGLE");


        when(wishlistDao.findByUserIdAndItemId(anyInt(), any())).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Object> response = wishlistService.addLikeService(req);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(wishlistDao, times(1)).save(any(Like.class));
    }

    @Test
    void testAddLikeService_Conflict() {
        // Arrange
        AddLikeReq req = new AddLikeReq();
        req.setUserId(1);
        req.setItemId("item001");

        Like existingLike = new SingleLike();
        when(wishlistDao.findByUserIdAndItemId(anyInt(), any())).thenReturn(Optional.of(existingLike));

        // Act
        ResponseEntity<Object> response = wishlistService.addLikeService(req);

        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(
            new ErrorMsg(ErrorMsgEnum.WISHLIST_CONFLICT.ErrorMsg),
            response.getBody()
        );
        verify(wishlistDao, never()).save(any(Like.class));
    }
}
