package edu.nus.market.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonIgnore  //
    private ObjectId id;  // for MongoDB


    @JsonIgnore
    private int userId;
    @JsonIgnore
    private String nickname;
    @JsonIgnore
    private String avatarUrl;

    private String type;  // "SINGLE" or "PACK"
    @JsonProperty("id")
    private String itemId;
    private Date wantedAt;  // 收藏日期
    private String name;
    private int status;
    private double price;
    private Seller seller;

}
