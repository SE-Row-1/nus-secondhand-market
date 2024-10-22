package edu.nus.market.service;

import edu.nus.market.pojo.ResEntity.EmailMessage;

public interface MQService {
    public void sendEmailMessage(EmailMessage message);
}
