package edu.nus.market.service;

import edu.nus.market.pojo.ResEntity.UpdateMessage;

public interface MQService {
    public void sendUpdateMessage(UpdateMessage message);
    public void sendDeleteMessage(String message);
}
