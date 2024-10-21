package edu.nus.market.config;

import jakarta.annotation.Resource;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    // 使用 Jackson2JsonMessageConverter 将消息序列化为 JSON 格式
    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }

    // 定义 Topic 交换机

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange("account");
    }
    // 定义 Topic 类型的队列
    @Bean
    public Queue updateQueue() {
        return new Queue("updated", true);
    }

    // 定义 Topic 类型的队列
    @Bean
    public Queue deleteQueue() {
        return new Queue("deleted", true);
    }

    // bind updateQueue to topic exchange with routing key "update.#"
    @Bean
    public Binding updateBinding(Queue updateQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(updateQueue).to(topicExchange).with("account.updated.#");
    }


    // bind deleteQueue to topic exchange with routing key "delete.#"
    @Bean
    public Binding deleteBinding(Queue deleteQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(deleteQueue).to(topicExchange).with("account.deleted.#");
    }
}
