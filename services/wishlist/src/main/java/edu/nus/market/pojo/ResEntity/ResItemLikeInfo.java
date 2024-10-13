package edu.nus.market.pojo.ResEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResItemLikeInfo{
    private int count;
    private Date LatestfavoriteDate;
}
