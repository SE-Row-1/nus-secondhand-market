package edu.nus.market.pojo;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileReq {
    private String nickname;

    private String avatar;

    @Pattern(regexp = "^[0-9]+$")
    private String phoneCode;

    @Pattern(regexp = "^[0-9]+$")
    private String phoneNumber;

    private String currency;
}
