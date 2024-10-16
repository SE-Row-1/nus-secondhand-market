package edu.nus.market;

import edu.nus.market.dao.WishlistDao;
import edu.nus.market.pojo.*;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class WishlistDAOTest {

    @Autowired
    private WishlistDao wishlistDao;

    private static final String ITEM_ID = "test-item";
    private static final int USER_COUNT = 5;
    private final ExecutorService executorService = Executors.newFixedThreadPool(USER_COUNT);

    @BeforeEach
    public void setup() {
        wishlistDao.deleteAll();  // 确保每次测试前数据库为空
    }

    @AfterEach
    public void cleanup() {
        wishlistDao.deleteAll();  // 测试后清理数据
    }

    @Test
    @Order(1)
    public void testAddAndRetrieveLike_Success() {
        // Arrange: 添加单个收藏记录
        SingleLike like = createLike(1, ITEM_ID);
        wishlistDao.save(like);

        // Act: 读取该用户的收藏
        List<Like> likes = wishlistDao.findByUserIdOrderByWantedAtDesc(1);

        // Assert: 验证添加和读取成功
        assertEquals(1, likes.size());
        assertEquals(ITEM_ID, likes.get(0).getItemId());
    }

    @Test
    @Order(2)
    public void testAddLike_Conflict() {
        // Arrange: 插入重复收藏记录
        wishlistDao.save(createLike(1, ITEM_ID));

        // Act: 再次添加同一条记录
        Optional<Like> existingLike = wishlistDao.findByUserIdAndItemId(1, ITEM_ID);

        // Assert: 验证冲突检测
        assertTrue(existingLike.isPresent());
    }

    @Test
    @Order(3)
    public void testDeleteLike_Success() {
        // Arrange: 添加并删除收藏记录
        SingleLike like = createLike(1, ITEM_ID);
        wishlistDao.save(like);

        // Act: 删除该记录
        wishlistDao.delete(like);

        // Assert: 验证删除成功
        assertEquals(0, wishlistDao.countByItemId(ITEM_ID));
    }

    @Test
    @Order(4)
    public void testGetItemLikeInfo() {
        // Arrange: 添加一条收藏记录
        wishlistDao.save(createLike(1, ITEM_ID));

        // Act: 查询该商品的收藏次数和最近的收藏时间
        int count = wishlistDao.countByItemId(ITEM_ID);
        Date favoriteDate = wishlistDao.findTopWantedAtByItemId(ITEM_ID);

        // Assert: 验证查询结果
        assertEquals(1, count);
        assertNotNull(favoriteDate);
    }

    @Test
    @Order(5)
    public void testConcurrentWritesAndReads() throws InterruptedException, ExecutionException {
        List<Future<Boolean>> futures = new ArrayList<>();

        // Act: 模拟多个用户并发写入
        for (int i = 1; i <= USER_COUNT; i++) {
            final int userId = i;
            futures.add(executorService.submit(() -> {
                wishlistDao.save(createLike(userId, ITEM_ID));
                return true;
            }));
        }

        // 确保所有任务完成
        for (Future<Boolean> future : futures) {
            assertTrue(future.get());
        }

        // Assert: 验证写入的数量
        assertEquals(USER_COUNT, wishlistDao.countByItemId(ITEM_ID));

        // Act: 验证每个用户的收藏读取是否隔离
        for (int i = 1; i <= USER_COUNT; i++) {
            final int userId = i;
            List<Like> likes = wishlistDao.findByUserIdOrderByWantedAtDesc(userId);
            assertEquals(1, likes.size());
            assertEquals(userId, likes.get(0).getUserId());
        }
    }

    @Test
    @Order(6)
    public void testDeleteNonExistentLike() {
        // Arrange: 确保数据库为空
        assertEquals(0, wishlistDao.countByItemId(ITEM_ID));

        // Act: 删除不存在的收藏记录
        SingleLike nonExistentLike = createLike(1, ITEM_ID);
        wishlistDao.delete(nonExistentLike);

        // Assert: 验证无异常抛出且数据库仍为空
        assertEquals(0, wishlistDao.countByItemId(ITEM_ID));
    }

    private SingleLike createLike(int userId, String itemId) {
        SingleLike like = new SingleLike();
        like.setId(new ObjectId());
        like.setUserId(userId);
        like.setItemId(itemId);
        like.setWantedAt(new Date());
        like.setName("Test Item");
        like.setStatus(1);
        like.setSeller(new Seller("seller001", "Test Store", "http://example.com/avatar.jpg"));
        return like;
    }
}
