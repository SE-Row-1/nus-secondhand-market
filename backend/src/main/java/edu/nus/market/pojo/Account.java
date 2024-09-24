package com.example.apps.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    int uid;
    String email;
    String nickname;
    String avatarUrl;
    int departmentId;
    String phone;
    String preferredCurrency;
    String createdAt;
    String deletedAt;
}
