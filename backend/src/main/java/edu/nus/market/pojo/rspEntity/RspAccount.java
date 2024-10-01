package edu.nus.market.pojo.rspEntity;

import edu.nus.market.pojo.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RspAccount {
    int id;
    String email;
    String nickname;
    String avatarUrl;
    int departmentId;
    String phone;
    String preferredCurrency;
    String createdAt;
    String deletedAt;


    // all args constructor, input an account object, and convert to this rspAccount object
    public RspAccount(Account account) {
        this.id = account.getId();
        this.email = account.getEmail();
        this.nickname = account.getNickname();
        this.avatarUrl = account.getAvatarUrl();
        this.departmentId = account.getDepartmentId();
        this.phone = account.getPhone();
        this.preferredCurrency = account.getPreferredCurrency();
        this.createdAt = account.getCreatedAt();
        this.deletedAt = account.getDeletedAt();
    }
}

