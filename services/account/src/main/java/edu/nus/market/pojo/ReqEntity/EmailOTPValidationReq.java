package edu.nus.market.pojo.ReqEntity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailOTPValidationReq {
    @NotBlank
    String otp;

    @NotBlank
    UUID id;
}
