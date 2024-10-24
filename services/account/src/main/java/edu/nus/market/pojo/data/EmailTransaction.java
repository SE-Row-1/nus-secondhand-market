package edu.nus.market.pojo.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailTransaction {
    @Column(name = "id")
    UUID id;

    @Column(name = "email")
    String email;

    @Column(name = "otp")
    String otp;

    @Column(name = "created_at")
    String createdAt;

    @Column(name = "verified_at")
    String verifiedAt;

    public EmailTransaction(String email, String otp)
    {
        this.email = email;
        this.otp = otp;
    }
}
