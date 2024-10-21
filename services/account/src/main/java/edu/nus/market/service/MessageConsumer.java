package edu.nus.market.service;

import edu.nus.market.pojo.ResEntity.UpdateMessage;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class MessageConsumer {
    // 监听 Update 队列
    @RabbitListener(queues = "updated")
    public void receiveUpdateMessage(UpdateMessage message) {
        System.out.println("Received update message: " + message);
    }

    // listen to delete queue
    @RabbitListener(queues = "deleted")
    public void receiveDeleteMessage(String message) {
        System.out.println("Received delete message: " + message);
    }
}

