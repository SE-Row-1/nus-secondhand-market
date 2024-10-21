package edu.nus.market.pojo.ResEntity;

import edu.nus.market.pojo.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMessage {
    int id;

    String email;

    String nickname;

    String avatarUrl;

    int departmentId;

    String phoneCode;

    String phoneNumber;

    String preferredCurrency;

    String createdAt;

    String deletedAt;

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("UpdateMessage{")
            .append("id=").append(id)
            .append(", email='").append(email).append('\'')
            .append(", nickname='").append(nickname).append('\'')
            .append(", avatarUrl='").append(avatarUrl).append('\'')
            .append(", departmentId=").append(departmentId)
            .append(", phoneCode='").append(phoneCode).append('\'')
            .append(", phoneNumber='").append(phoneNumber).append('\'')
            .append(", preferredCurrency='").append(preferredCurrency).append('\'')
            .append(", createdAt='").append(createdAt).append('\'')
            .append(", deletedAt='").append(deletedAt).append('\'')
            .append('}');
        return sb.toString();
    }

    // all args constructor, input an Account object, and convert to this UpdateMessage object
    public UpdateMessage(Account account) {
        this.id = account.getId();
        this.email = account.getEmail();
        this.nickname = account.getNickname();
        this.avatarUrl = account.getAvatarUrl();
        this.departmentId = account.getDepartmentId();
        this.phoneCode = account.getPhoneCode();
        this.phoneNumber = account.getPhoneNumber();
        this.preferredCurrency = account.getPreferredCurrency();
        this.createdAt = account.getCreatedAt();
        this.deletedAt = account.getDeletedAt();
    }
}

