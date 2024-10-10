package edu.nus.market.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "wishlist")
public class Like {
    private ObjectId id;  // MongoDB 的唯一标识符
    private String type;

    private int userId;  // 用户ID
    private String itemId;  // 商品ID

    private Date favoriteDate;  // 收藏日期
    private String itemName;
    private int itemStatus;

    private double price;
    private String photoURL;



    @Override
    public String toString() {
        return "Favorite{" +
            "id='" + id + '\'' +
            ", userId='" + userId + '\'' +
            ", itemId='" + itemId + '\'' +
            ", favoriteDate=" + favoriteDate +
            '}';
    }
}
