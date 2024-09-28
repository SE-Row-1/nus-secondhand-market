package edu.nus.market.pojo.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Register {
    @Email
    String email;

    String nickname;

    String avatarUrl;

    int departmentId;

    @NotBlank
    String password;

    @Pattern(regexp = "^[0-9]+$")
    String phone;

    String preferredCurrency;
}
