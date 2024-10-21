package edu.nus.market.service;

import edu.nus.market.pojo.ResEntity.UpdateMessage;

public interface MQservice {
    public void sendUpdateMessage(UpdateMessage message);
    public void sendDeleteMessage(String message);
}
