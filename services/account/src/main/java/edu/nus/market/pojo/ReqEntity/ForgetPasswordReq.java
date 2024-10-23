package edu.nus.market.pojo.ReqEntity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForgetPasswordReq {
    @NotBlank
    UUID id;

    @NotBlank
    @Size(min = 8, max = 20)
    String newPassword;
}
