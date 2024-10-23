package edu.nus.market.pojo.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailTransaction {
    @Column(name = "id")
    String id;

    @Column(name = "email")
    String email;

    @Column(name = "otp")
    String otp;

    @Column(name = "created_at")
    String createdAt;

    @Column(name = "verified_at")
    String verifiedAt;

    public EmailTransaction(String uuid, String email, String otp)
    {
        this.id = uuid;
        this.email = email;
        this.otp = otp;
    }
}
