package edu.nus.market;

import edu.nus.market.dao.WishlistDao;
import edu.nus.market.pojo.*;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import edu.nus.market.pojo.ResEntity.ResItemLikeInfo;
import edu.nus.market.service.WishlistServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class WishlistServiceImplTest {

    @Mock
    private WishlistDao wishlistDao;

    @InjectMocks
    private WishlistServiceImpl wishlistService;

    private Like mockLike;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        prepareTestData();
    }

    private void prepareTestData() {
        mockLike = new SingleLike();
        mockLike.setUserId(1);
        mockLike.setItemId("item001");
        mockLike.setName("iPhone 12");
        mockLike.setStatus(1);
        mockLike.setWantedAt(new Date());
    }

    @Test
    void testGetWishlistService_Success() {
        List<Like> mockLikes = List.of(mockLike);
        when(wishlistDao.findByUserIdOrderByWantedAtDesc(anyInt())).thenReturn(mockLikes);

        ResponseEntity<Object> response = wishlistService.getWishlistService(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockLikes, response.getBody());
    }

    @Test
    void testGetWishlistService_EmptyList() {
        when(wishlistDao.findByUserIdOrderByWantedAtDesc(anyInt())).thenReturn(List.of());

        ResponseEntity<Object> response = wishlistService.getWishlistService(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0, ((List<?>) response.getBody()).size());
    }

    @Test
    void testAddLikeService_Success() {
        AddLikeReq req = new AddLikeReq();
        req.setUserId(1);
        req.setItemId("item001");
        req.setPrice(99.0);
        req.setName("iPhone 12");
        req.setStatus(1);
        req.setPhotoUrls(new String[]{"https://example.com/image.jpg"});
        req.setSeller(new Seller("seller001", "John's Store", "http://example.com/avatar.jpg"));
        req.setType("single");

        when(wishlistDao.findByUserIdAndItemId(anyInt(), anyString())).thenReturn(Optional.empty());

        ResponseEntity<Object> response = wishlistService.addLikeService(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(wishlistDao, times(1)).save(any(Like.class));
    }

    @Test
    void testAddLikeService_Conflict() {
        AddLikeReq req = new AddLikeReq();
        req.setUserId(1);
        req.setItemId("item001");
        req.setPrice(99.0);
        req.setName("iPhone 12");
        req.setStatus(1);
        req.setPhotoUrls(new String[]{"https://example.com/image.jpg"});
        req.setSeller(new Seller("seller001", "John's Store", "http://example.com/avatar.jpg"));
        req.setType("SINGLE");

        when(wishlistDao.findByUserIdAndItemId(anyInt(), anyString())).thenReturn(Optional.of(mockLike));

        ResponseEntity<Object> response = wishlistService.addLikeService(req);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.WISHLIST_CONFLICT.ErrorMsg), response.getBody());
        verify(wishlistDao, never()).save(any(Like.class));
    }

    @Test
    void testDeleteLikeService_Success() {
        when(wishlistDao.findByUserIdAndItemId(anyInt(), anyString())).thenReturn(Optional.of(mockLike));

        ResponseEntity<Object> response = wishlistService.deleteLikeService(1, "item001");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(wishlistDao, times(1)).delete(mockLike);
    }

    @Test
    void testDeleteLikeService_NotFound() {
        when(wishlistDao.findByUserIdAndItemId(anyInt(), anyString())).thenReturn(Optional.empty());

        ResponseEntity<Object> response = wishlistService.deleteLikeService(1, "item001");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(new ErrorMsg(ErrorMsgEnum.LIKE_NOT_FOUND.ErrorMsg), response.getBody());
        verify(wishlistDao, never()).delete(any(Like.class));
    }

    @Test
    void testGetItemLikeInfo_Success() {
        when(wishlistDao.countByItemId(anyString())).thenReturn(1);
        when(wishlistDao.findTopFavoriteDateByItemId(anyString())).thenReturn(new Date());

        ResponseEntity<Object> response = wishlistService.getItemLikeInfo("item001");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResItemLikeInfo.class, response.getBody().getClass());
    }
}
