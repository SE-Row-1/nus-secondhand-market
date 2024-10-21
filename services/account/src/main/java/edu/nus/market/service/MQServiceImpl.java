package edu.nus.market.service;

import edu.nus.market.pojo.ResEntity.UpdateMessage;
import org.apache.ibatis.annotations.Update;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MQServiceImpl implements MQservice{

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private static final Logger logger = LoggerFactory.getLogger(MQServiceImpl.class);

    // send updated message，use `account.updated.success`
    public void sendUpdateMessage(UpdateMessage message) {
        rabbitTemplate.convertAndSend("account", "account.updated.success", message);
        logger.info("Sent update message: " + message);
    }

    // send deleted message, `account.deleted.success`
    public void sendDeleteMessage(String message) {
        rabbitTemplate.convertAndSend("account", "account.deleted.success", message);
        logger.info("Sent delete message: " + message);
    }
}

