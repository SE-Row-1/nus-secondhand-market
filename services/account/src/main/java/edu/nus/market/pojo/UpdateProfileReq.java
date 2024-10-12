package edu.nus.market.pojo;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileReq {
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@u\\.nus\\.edu$")
    private String email;

    private String nickname;

    private String avatarUrl;

    @Pattern(regexp = "^[0-9]+$")
    private String phoneCode;

    @Pattern(regexp = "^[0-9]+$")
    private String phoneNumber;

    private String preferredCurrency;

    private Integer departmentId;
}
