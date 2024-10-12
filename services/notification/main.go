package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
	amqp "github.com/rabbitmq/amqp091-go"
	"nshm.shop/notification/notification"
)

func main() {
	connection, err := amqp.Dial(os.Getenv("RABBITMQ_URI"))
	if err != nil {
		log.Panic(err)
	}
	defer connection.Close()

	channel, err := connection.Channel()
	if err != nil {
		log.Panic(err)
	}
	defer channel.Close()

	err = channel.ExchangeDeclare("notification", "topic", false, false, false, false, nil)
	if err != nil {
		log.Panic(err)
	}

	err = startQueue[notification.EmailPayload](channel, "email")
	if err != nil {
		log.Panic(err)
	}

	err = startQueue[notification.WhatsappPayload](channel, "whatsapp")
	if err != nil {
		log.Panic(err)
	}

	log.Print("service started")

	var forever = make(chan struct{})
	<-forever
}

func startQueue[Payload interface{ Process() error }](ch *amqp.Channel, topic string) error {
	queue, err := ch.QueueDeclare("notification."+topic, false, false, false, false, nil)
	if err != nil {
		return fmt.Errorf("failed to declare queue '%s'", queue.Name)
	}

	err = ch.QueueBind(queue.Name, topic, "notification", false, nil)
	if err != nil {
		return fmt.Errorf("failed to bind queue '%s'", queue.Name)
	}

	deliveries, err := ch.Consume(queue.Name, "", false, false, false, false, nil)
	if err != nil {
		return fmt.Errorf("failed to consume queue '%s'", queue.Name)
	}

	go func() {
		for delivery := range deliveries {
			var payload Payload

			err := json.Unmarshal(delivery.Body, &payload)
			if err != nil {
				log.Printf("failed to parse payload: %s", err)
				delivery.Nack(false, false)
				continue
			}

			err = payload.Process()
			if err != nil {
				log.Printf("failed to process payload: %s", err)
				delivery.Nack(false, false)
				continue
			}

			delivery.Ack(false)
		}
	}()

	return nil
}
