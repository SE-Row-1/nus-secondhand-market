package edu.nus.market.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.connection.Connection;
import org.springframework.amqp.rabbit.connection.ConnectionListener;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQConnectionListener implements ConnectionListener {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMQConnectionListener.class);

    @Override
    public void onCreate(Connection connection) {
        logger.info("Successfully connected to RabbitMQ.");
    }

    @Override
    public void onClose(Connection connection) {
        logger.warn("Disconnected from RabbitMQ.");
    }
}
