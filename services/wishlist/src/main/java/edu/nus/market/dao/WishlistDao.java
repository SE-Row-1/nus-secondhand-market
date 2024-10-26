package edu.nus.market.dao;

import edu.nus.market.pojo.Like;
import edu.nus.market.pojo.ResEntity.ResSeller;
import edu.nus.market.pojo.ResEntity.ResUserInfo;
import edu.nus.market.pojo.Seller;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;


public interface WishlistDao extends MongoRepository<Like, ObjectId> {
    // 自定义查询方法
    List<Like> findTop10ByUserIdAndWantedAtBeforeOrderByWantedAtDesc(int userId, Date before);

    //insert one Like just use save()

    //get Like by userid and item id
    Optional<Like> findByUserIdAndItemId(int userId, String itemId);

    @Aggregation(pipeline = {
        "{ $match: { 'itemId': ?0 } }",
        "{ $sort: { 'wantedAt': -1 } }",
        "{ $limit: 1 }",
        "{ $project: { 'wantedAt': 1, '_id': 0 } }"
    })
    Date findTopWantedAtByItemId(String itemId);

    int countByItemId(String itemId);

    void deleteAllByUserId(int userId);

    @Query(value = "{ 'seller.id': ?0 }", delete = true)
    void deleteBySellerId(int userId);

    @Query(value = "{ 'itemId': ?0 }", delete = true)
    void deleteByItemId(String itemId);

    Optional<Like> findFirstByItemId(String itemId);

    @Query(value = "{ 'itemId': ?0 }", fields = "{ 'userId': 1, 'nickname': 1, 'avatarUrl': 1 }")
    List<ResUserInfo> findUserInfoByItemId(String itemId);

    List<Like> findByItemId(String itemId);

}
