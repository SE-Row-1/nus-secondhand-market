package edu.nus.market.pojo.data;

import edu.nus.market.pojo.ReqEntity.RegisterReq;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    @Column(name = "id")
    int id;

    @Column(name = "email")
    String email;

    @Column(name = "nickname")
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

    public Account(RegisterReq registerReq){
        this.nickname = registerReq.getNickname();
        this.avatarUrl = null;
        this.departmentId = 0;
        this.phoneCode = null;
        this.phoneNumber = null;
        this.preferredCurrency = null;
    }

    public Account(int id, String email){
        this.id = id;
        this.email = email;
        this.nickname = null;
        this.avatarUrl = null;
        this.departmentId = 0;
        this.phoneCode = null;
        this.phoneNumber = null;
        this.preferredCurrency = null;
    }

}
