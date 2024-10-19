package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/joho/godotenv/autoload"
	amqp "github.com/rabbitmq/amqp091-go"
	"nshm.shop/notification/processors"
)

func main() {
	connection, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		log.Panic(err)
	}
	defer connection.Close()

	channel, err := connection.Channel()
	if err != nil {
		log.Panic(err)
	}
	defer channel.Close()

	err = channel.ExchangeDeclare("notification", "topic", true, false, false, false, nil)
	if err != nil {
		log.Panic(err)
	}

	err = startQueue[processors.EmailPayload](channel, "email")
	if err != nil {
		log.Panic(err)
	}

	startHealthCheck()

	log.Print("service started")

	var forever = make(chan struct{})
	<-forever
}

func startQueue[Payload interface{ Process() error }](ch *amqp.Channel, topic string) error {
	queue, err := ch.QueueDeclare("notification."+topic, true, false, false, false, nil)
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

func startHealthCheck() {
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	go func() {
		err := http.ListenAndServe(":"+os.Getenv("PORT"), nil)
		if err != nil {
			log.Panic(err)
		}
	}()
}
