package edu.nus.market.pojo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddLikeReq {

    @NotBlank
    private String type;


    private int userId;  // 用户ID
    @NotBlank
    private String itemId;  // 商品ID


    @NotBlank
    private String itemName;
    @NotBlank
    private int itemStatus;

    @NotBlank
    private double price;
    @NotBlank
    private String photoURL;

}
