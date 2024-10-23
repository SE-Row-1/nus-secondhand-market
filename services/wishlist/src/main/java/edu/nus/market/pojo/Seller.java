package edu.nus.market.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Seller {

    @NotBlank
    @JsonProperty("id")
    @Field("sellerId")
    private int sellerId;
    @NotBlank
    private String nickname;
    @NotBlank
    private String avatarUrl;
}
