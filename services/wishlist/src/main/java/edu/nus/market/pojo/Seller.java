package edu.nus.market.pojo;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Seller {
    @NotBlank
    private int id;
    @NotBlank
    private String nickname;
    @NotBlank
    private String avatarUrl;
}
