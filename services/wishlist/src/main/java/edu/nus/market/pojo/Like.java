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
public abstract class Like {

    private ObjectId id;  // for MongoDB
    private String type;  // "SINGLE" or "PACK"
    private int userId;
    private String itemId;
    private Date favoriteDate;  // 收藏日期
    private String itemName;
    private int itemStatus;
    private double price;
    private Seller seller;

}
