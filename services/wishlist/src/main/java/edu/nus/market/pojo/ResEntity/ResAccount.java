package edu.nus.market.pojo.ResEntity;

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

    int departmentId;

    String phoneCode;

    String phoneNumber;

    String preferredCurrency;

    String createdAt;

    String deletedAt;
}

