package edu.nus.market.pojo.ResEntity;

import edu.nus.market.pojo.data.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResAccount {
    int id;

    String email;

    String nickname;

    String avatarUrl;

    Integer departmentId;

    String phoneCode;

    String phoneNumber;

    String preferredCurrency;

    String createdAt;

    String deletedAt;


    // all args constructor, input an account object, and convert to this rspAccount object
    public ResAccount(Account account) {
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

