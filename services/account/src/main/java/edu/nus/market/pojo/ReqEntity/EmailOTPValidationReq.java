package edu.nus.market.pojo.ReqEntity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailOTPValidationReq {
    @NotBlank
    String otp;

    @NotNull
    UUID id;
}
