package edu.nus.market.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddLikeReq {

    @NotBlank
    private String type;  //  "SINGLE" or "PACK"


    private int userId;  // add manually from path variable

    @NotBlank
    @JsonProperty("id")
    private String itemId;

    @NotBlank
    private String itemName;

    @NotNull
    private int itemStatus;

    @NotNull
    private Double price;

    // for SINGLE Item
    private String[] photoUrls;

    // for PACK Item
    private List<AddLikeReq> children;

    private Double discount;

    @NotNull
    private Seller seller;  // 卖家的 ID、昵称和头像


}
