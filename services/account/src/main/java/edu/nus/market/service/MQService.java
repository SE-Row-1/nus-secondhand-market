package edu.nus.market.service;

import edu.nus.market.pojo.ResEntity.UpdateMessage;
import edu.nus.market.pojo.ResEntity.EmailMessage;

public interface MQService {
    public void sendEmailMessage(EmailMessage message);
    public void sendUpdateMessage(UpdateMessage message);
    public void sendDeleteMessage(String message);
}
