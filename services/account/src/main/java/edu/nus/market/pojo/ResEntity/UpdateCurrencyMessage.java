package edu.nus.market.pojo.ResEntity;

import edu.nus.market.pojo.data.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCurrencyMessage {
    String oldCurrency;

    String newCurrency;


    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("UpdateCurrencyMessage{")
            .append("oldCurrency='").append(oldCurrency).append('\'')
            .append(", newCurrency='").append(newCurrency).append('\'')
            .append('}');
        return sb.toString();
    }
}
