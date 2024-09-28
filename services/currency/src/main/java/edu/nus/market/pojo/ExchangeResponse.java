package edu.nus.market.pojo.exchangeRate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ExchangeResponse {

    boolean success;
    String terms;
    String privacy;
    long timestamp;
    String source;
    Map<String, Double> quotes;
}
