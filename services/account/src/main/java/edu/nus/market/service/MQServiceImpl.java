package edu.nus.market.service;

import edu.nus.market.pojo.ResEntity.UpdateMessage;
import org.apache.ibatis.annotations.Update;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MQServiceImpl implements MQservice{

    @Autowired
    private RabbitTemplate rabbitTemplate;

    // 发送订单相关的消息，使用路由键 `order.created`
    public void sendUpdateMessage(UpdateMessage message) {
        rabbitTemplate.convertAndSend("topicExchange", "update.success", message);
        System.out.println("Sent order message: " + message);
    }

    // 发送支付相关的消息，使用路由键 `payment.success`
    public void sendDeleteMessage(String message) {
        rabbitTemplate.convertAndSend("topicExchange", "delete.success", message);
        System.out.println("Sent payment message: " + message);
    }
}

