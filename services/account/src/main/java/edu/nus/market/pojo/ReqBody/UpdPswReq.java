package edu.nus.market.pojo.ReqBody;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdPswReq {
    @NotBlank
    String oldPassword;
    @NotBlank
    String newPassword;
}
