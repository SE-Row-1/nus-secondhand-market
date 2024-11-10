package edu.nus.currency.pojo.ResEntity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResCurrency {
    private String currencyName;
    private double currencyValue;
    private String updatedTime;
}
