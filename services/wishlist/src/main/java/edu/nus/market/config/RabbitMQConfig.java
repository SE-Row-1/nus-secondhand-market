package edu.nus.market.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {


    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange("account");
    }


    // 定义 Topic 类型的队列
    @Bean
    public Queue deleteQueue() {
        return new Queue("account.deleted", true);
    }


    // bind deleteQueue to topic exchange with routing key "delete.#"
    @Bean
    public Binding deleteBinding(Queue deleteQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(deleteQueue).to(topicExchange).with("account.deleted.#");
    }
}
