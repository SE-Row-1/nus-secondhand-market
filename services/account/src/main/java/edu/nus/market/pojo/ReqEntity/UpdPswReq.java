package edu.nus.market.pojo.ReqEntity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdPswReq {
    @NotBlank
    @Size(min = 8, max = 20)
    String oldPassword;

    @NotBlank
    @Size(min = 8, max = 20)
    String newPassword;
}
