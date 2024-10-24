package edu.nus.market.pojo.ResEntity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResUserInfo {
    @JsonProperty("id")
    private int userId;
    private String nickname;
    private String avatarUrl;
}
