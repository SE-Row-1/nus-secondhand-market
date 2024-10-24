package edu.nus.market.pojo.ResEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResItemLikeInfo{
    private int count;
    private Date LastWantedAt;

    private List<ResUserInfo> wanters;
}
