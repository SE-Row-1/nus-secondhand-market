package edu.nus.market.dao;

import edu.nus.market.pojo.Like;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface WishlistDao extends MongoRepository<Like, ObjectId> {
    // 自定义查询方法
    List<Like> findByUserId(int userId);

    Like findTopByItemIdOrderByFavoriteDateDesc(String itemId);

    //insert one Like just use save()

}
