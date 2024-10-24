package edu.nus.market.pojo.ReqEntity;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileReq {
    private UUID Id;

    @Size(min = 2, max = 20)
    private String nickname;

    private String avatarUrl;

    @Pattern(regexp = "^[0-9]+$")
    private String phoneCode;

    @Pattern(regexp = "^[0-9]+$")
    private String phoneNumber;

    private String preferredCurrency;

    private Integer departmentId;
}
