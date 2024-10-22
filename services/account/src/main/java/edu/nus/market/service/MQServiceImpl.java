package edu.nus.market.service;

import edu.nus.market.pojo.ResEntity.EmailMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MQServiceImpl implements MQService{

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private static final Logger logger = LoggerFactory.getLogger(MQServiceImpl.class);

    // send email otp message，use `Email`
    public void sendEmailMessage(EmailMessage message) {
        rabbitTemplate.convertAndSend("email", "Email", message);
        logger.info("Sent email message: " + message);
    }
}
