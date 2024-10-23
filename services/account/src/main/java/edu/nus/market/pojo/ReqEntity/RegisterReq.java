package edu.nus.market.pojo.ReqEntity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterReq {
//    @NotBlank
//    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@u\\.nus\\.edu$")
//    String email;
//
    // this id means transaction_id
    String id;

    @Size(min = 8, max = 20)
    String nickname;
//
//    String avatarUrl;
//
//    int departmentId;

    @NotBlank
    @Size(min = 8, max = 20)
    String password;

//    @Pattern(regexp = "^[0-9]+$")
//    String phone;
//
//    String preferredCurrency;
}
