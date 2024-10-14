package edu.nus.market.dao;

import edu.nus.market.pojo.Like;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;


public interface WishlistDao extends MongoRepository<Like, ObjectId> {
    // 自定义查询方法
    List<Like> findByUserId(int userId);

    //insert one Like just use save()

    //get Like by userid and item id
    Optional<Like> findByUserIdAndItemId(int userId, String itemId);

    @Aggregation(pipeline = {
        "{ $match: { 'itemId': ?0 } }",
        "{ $sort: { 'favoriteDate': -1 } }",
        "{ $limit: 1 }",
        "{ $project: { 'favoriteDate': 1, '_id': 0 } }"
    })
    Date findTopFavoriteDateByItemId(String itemId);

    int countByItemId(String itemId);

}
