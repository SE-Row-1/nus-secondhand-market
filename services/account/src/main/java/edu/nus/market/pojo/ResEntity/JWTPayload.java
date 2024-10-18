package edu.nus.market.pojo.ResEntity;

import edu.nus.market.pojo.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JWTPayload {
    int id;

    String nickname;

    String avatarUrl;

    // all args constructor, input an account object, and convert to this rspAccount object
    public JWTPayload(Account account) {
        this.id = account.getId();
        this.nickname = account.getNickname();
        this.avatarUrl = account.getAvatarUrl();
    }
}
