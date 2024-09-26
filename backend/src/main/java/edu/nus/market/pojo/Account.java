package edu.nus.market.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    int id;
    String email;
    String nickname;
    String avatarUrl;
    int departmentId;
    String phone;
    String preferredCurrency;

    String createdAt;
    String deletedAt;
    String passwordHash;
    String passwordSalt;

    public Account(Register register){
        this.email = register.getEmail();
        this.nickname = register.getNickname();
        this.avatarUrl = register.getAvatarUrl();
        this.departmentId = register.getDepartmentId();
        this.phone = register.getPhone();
        this.preferredCurrency = register.getPreferredCurrency();
    }
}
