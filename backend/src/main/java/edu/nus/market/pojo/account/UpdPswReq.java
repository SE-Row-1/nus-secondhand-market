package edu.nus.market.pojo.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdPswReq {
    @Email
    String email;
    @NotBlank
    String oldPassword;
    @NotBlank
    String newPassword;
}
