FROM rabbitmq:4-management

WORKDIR /

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v4.0.2/rabbitmq_delayed_message_exchange-4.0.2.ez -o $RABBITMQ_HOME/plugins/rabbitmq_delayed_message_exchange-4.0.2.ez

RUN chown rabbitmq:rabbitmq $RABBITMQ_HOME/plugins/rabbitmq_delayed_message_exchange-4.0.2.ez

RUN rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange

CMD ["rabbitmq-server"]
