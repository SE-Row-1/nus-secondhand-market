package edu.nus.market.pojo.ReqEntity;

import com.fasterxml.jackson.annotation.JsonProperty;
import edu.nus.market.pojo.Seller;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddLikeReq {


    // add manually from path variable
    private int userId;

    private String nickname;

    private String avatarUrl;

    private String email;

    @NotBlank
    @JsonProperty("id")
    private String itemId;

    @NotBlank
    @Pattern(regexp = "single|pack")
    private String type;  //  only "single" or "pack"

    @NotNull
    private Seller seller;  //

    @NotBlank
    private String name;

    @NotNull
    private Double price;

    @NotNull
    private int status;


    // for SINGLE Item
    private List<String> photoUrls;

    // for PACK Item
    private List<AddLikeReq> children;

    private Double discount;




}
