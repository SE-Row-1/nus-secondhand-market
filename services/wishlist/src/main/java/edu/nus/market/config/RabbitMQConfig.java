package edu.nus.market.config;

import edu.nus.market.service.RabbitMQConnectionListener;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;


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

    //account update and deleted
    @Bean
    public TopicExchange topicAccount() {
        return new TopicExchange("account");
    }

    // 定义 Topic 类型的队列
    @Bean
    public Queue deletedAccount() {
        return new Queue("wishlist.account.deleted", true);
    }

    // bind deleteQueue to topic exchange with routing key "delete.#"
    @Bean
    public Binding deleteAccountBinding(Queue deletedAccount, TopicExchange topicAccount) {
        return BindingBuilder.bind(deletedAccount).to(topicAccount).with("account.deleted.#");
    }
    // 定义 Topic 类型的队列
    @Bean
    public Queue updatedAccount() {
        return new Queue("wishlist.account.updated", true);
    }

    // bind deleteQueue to topic exchange with routing key "update"
    @Bean
    public Binding updateAccountBinding(Queue updatedAccount, TopicExchange topicAccount) {
        return BindingBuilder.bind(updatedAccount).to(topicAccount).with("account.updated.#");
    }

    //item updated and deleted
    @Bean
    public TopicExchange topicItem() {
        return new TopicExchange("item");
    }

    @Bean
    public Queue deletedItem() {
        return new Queue("wishlist.item.deleted", true);
    }

    // bind deleteQueue to topic exchange with routing key "delete.#"
    @Bean
    public Binding deleteItemBinding(Queue deletedItem, TopicExchange topicItem) {
        return BindingBuilder.bind(deletedItem).to(topicItem).with("item.deleted");
    }
    @Bean
    public Queue updatedItem() {
        return new Queue("wishlist.item.updated", true);
    }

    // bind updateQueue to topic exchange with routing key "item.updated.#"
    @Bean
    public Binding updateItemBinding(Queue updatedItem, TopicExchange topicItem) {
        return BindingBuilder.bind(updatedItem).to(topicItem).with("item.updated");
    }


}
