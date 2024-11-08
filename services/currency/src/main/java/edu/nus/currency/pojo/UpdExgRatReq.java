package edu.nus.currency.pojo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdExgRatReq {
    @NotEmpty
    List<String> targetCurrencies;
    @NotBlank
    String sourceCurrency;
}
