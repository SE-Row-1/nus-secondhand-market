package edu.nus.market.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "wishlist")
public class PackLike extends Like {
    private Double discount;  // 打包商品的折扣
    private List<SingleLike> children;  // 包含的子商品列表

}
