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
    String avatar_url;
    int depart_id;
    String password;
    String phone;
    String preferred_currency;
}
