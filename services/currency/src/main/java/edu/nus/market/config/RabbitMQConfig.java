package edu.nus.market.config;

import edu.nus.market.service.RabbitMQConnectionListener;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitMQConnectionListener connectionListener(ConnectionFactory connectionFactory) {
        RabbitMQConnectionListener listener = new RabbitMQConnectionListener();
        connectionFactory.addConnectionListener(listener);
        return listener;
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    //account deleted
    @Bean
    public TopicExchange topicAccountCurrency() {
        return new TopicExchange("accountCurrency");
    }

    // 定义 Topic 类型的队列
    @Bean
    public Queue updatedAccountCurrency() {
        return new Queue("currency.account.currencyDeleted", true);
    }

    // bind deleteQueue to topic exchange with routing key "delete.#"
    @Bean
    public Binding deleteAccountBinding(Queue updatedAccountCurrency, TopicExchange topicAccountCurrency) {
        return BindingBuilder.bind(updatedAccountCurrency).to(topicAccountCurrency).with("account.deletedCurrency.#");
    }

}
