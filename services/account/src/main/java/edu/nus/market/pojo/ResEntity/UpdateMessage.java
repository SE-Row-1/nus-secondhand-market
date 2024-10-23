package edu.nus.market.pojo.ResEntity;

import edu.nus.market.pojo.data.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMessage {
    int id;

    String nickname;

    String avatarUrl;


    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("UpdateMessage{")
            .append("id=").append(id)
            .append(", nickname='").append(nickname).append('\'')
            .append(", avatarUrl='").append(avatarUrl).append('\'')
            .append('}');
        return sb.toString();
    }

    // all args constructor, input an Account object, and convert to this UpdateMessage object
    public UpdateMessage(Account account) {
        this.id = account.getId();
        this.nickname = account.getNickname();
        this.avatarUrl = account.getAvatarUrl();
    }
}

