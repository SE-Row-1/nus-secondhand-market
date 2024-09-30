package edu.nus.market.pojo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DelAccReq {
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@u\\.nus\\.edu$")
    String email;
    @NotBlank
    String password;
}
