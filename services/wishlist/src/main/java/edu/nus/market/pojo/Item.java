package edu.nus.market.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Data
public class Item {
    private String id;
    private String type;
    private String name;
    private String description;
    private double price;
    private String[] photoUrls;
    private Seller seller;
    private int status;
    private Date createdAt;
    private Date deletedAt;

}
