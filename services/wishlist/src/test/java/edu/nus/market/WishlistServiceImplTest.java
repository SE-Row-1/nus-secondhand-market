package edu.nus.market;

import edu.nus.market.dao.WishlistDao;
import edu.nus.market.pojo.*;
import edu.nus.market.pojo.ReqEntity.AddLikeReq;
import edu.nus.market.pojo.ResEntity.ResItemLikeInfo;
import edu.nus.market.pojo.ResEntity.ResLike;
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
        when(wishlistDao.findTop10ByUserIdAndWantedAtBeforeOrderByWantedAtDesc(anyInt(), any())).thenReturn(mockLikes);

        ResponseEntity<Object> response = wishlistService.getWishlistService(1, new Date());

        assertEquals(HttpStatus.OK, response.getStatusCode());

        // 确认返回体是 ResLike 类型
        ResLike resLike = (ResLike) response.getBody();

        // 验证 items 和 nextCursor
        assertEquals(mockLikes, resLike.getItems());
    }


    @Test
    void testGetWishlistService_EmptyList() {
        when(wishlistDao.findTop10ByUserIdAndWantedAtBeforeOrderByWantedAtDesc(anyInt(), any())).thenReturn(List.of());

        ResponseEntity<Object> response = wishlistService.getWishlistService(1, new Date());

        assertEquals(HttpStatus.OK, response.getStatusCode());

        // 确认返回体是 ResLike 类型
        ResLike resLike = (ResLike) response.getBody();

        // 验证 items 列表为空
        assertEquals(0, resLike.getItems().size());

        // nextCursor 应该为 null（根据逻辑）
        assertEquals(null, resLike.getNextCursor());
    }


    @Test
    void testAddLikeService_Success() {
        AddLikeReq req = new AddLikeReq();
        req.setUserId(1);
        req.setItemId("item001");
        req.setPrice(99.0);
        req.setName("iPhone 12");
        req.setStatus(1);
        req.setPhotoUrls(Arrays.asList("http://example.com/iphone12_front.jpg"));
        req.setSeller(new Seller(1, "John's Store", "http://example.com/avatar.jpg"));
        req.setType("single");

        when(wishlistDao.findByUserIdAndItemId(anyInt(), anyString())).thenReturn(Optional.empty());

        ResponseEntity<Object> response = wishlistService.addLikeService(req);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
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
        req.setPhotoUrls(Arrays.asList("http://example.com/iphone12_front.jpg"));
        req.setSeller(new Seller(1, "John's Store", "http://example.com/avatar.jpg"));
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

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
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
    void testGetItemLikeInfo_Service_Success() {
        when(wishlistDao.countByItemId(anyString())).thenReturn(1);
        when(wishlistDao.findTopWantedAtByItemId(anyString())).thenReturn(new Date());

        ResponseEntity<Object> response = wishlistService.getItemLikeInfoService("item001", 1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResItemLikeInfo.class, response.getBody().getClass());
    }
}
