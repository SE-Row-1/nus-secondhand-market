package edu.nus.market.pojo.ResEntity;

import edu.nus.market.pojo.Like;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ResWishlist {
    private String nextCursor;
    private List<Like> items;

}
