package edu.nus.market.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Register {
    String email;
    String nickname;
    String avatarUrl;
    int departmentId;
    String password;
    String phone;
    String preferredCurrency;
}
