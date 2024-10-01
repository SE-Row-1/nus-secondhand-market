package edu.nus.market.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    int id;

    String email;

    String nickname;

    @Column(name = "password_hash")
    String passwordHash;

    @Column(name = "password_salt")
    String passwordSalt;

    @Column(name = "avatar_url")
    String avatarUrl;

    @Column(name = "department_id")
    int departmentId;

    @Column(name = "phone_code")
    String phoneCode;

    @Column(name = "phone_number")
    String phoneNumber;

    @Column(name = "preferred_currency")
    String preferredCurrency;

    @Column(name = "created_at")
    String createdAt;

    @Column(name = "deleted_at")
    String deletedAt;

    public Account(Register register){
        this.email = register.getEmail();
        this.nickname = null;
        this.avatarUrl = null;
        this.departmentId = 0;
        this.phoneCode = null;
        this.phoneNumber = null;
        this.preferredCurrency = null;
    }

}
