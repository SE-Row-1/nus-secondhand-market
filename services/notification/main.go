package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	_ "github.com/joho/godotenv/autoload"
	amqp "github.com/rabbitmq/amqp091-go"
	"nshm.store/notification/notification"
)

func main() {
	connection, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		log.Panicf("failed to connect to RabbitMQ: %s", err)
	}
	defer connection.Close()

	channel, err := connection.Channel()
	if err != nil {
		log.Panicf("failed to open channel: %s", err)
	}
	defer channel.Close()

	err = channel.ExchangeDeclare("notification", "topic", true, false, false, false, nil)
	if err != nil {
		log.Panicf("failed to declare [Exchange notification]: %s", err)
	}
	log.Print("Declared [Exchange notification]")

	startConsumer[notification.EmailPayload](channel, "email")
	startConsumer[notification.BatchEmailPayload](channel, "batch-email")

	startProbe()

	forever := make(chan struct{})
	<-forever
}

func startConsumer[Payload interface{ Process() error }](ch *amqp.Channel, topic string) {
	queue, err := ch.QueueDeclare("notification."+topic, true, false, false, false, nil)
	if err != nil {
		log.Panicf("failed to declare [Queue %s]: %s", queue.Name, err)
	}
	log.Printf("Declared [Queue %s]", queue.Name)

	err = ch.QueueBind(queue.Name, topic, "notification", false, nil)
	if err != nil {
		log.Panicf("failed to bind [Queue %s] to [Topic %s]@[Exchange notification]: %s", queue.Name, topic, err)
	}
	log.Printf("Bound [Queue %s] to [Topic %s]@[Exchange notification]", queue.Name, topic)

	deliveries, err := ch.Consume(queue.Name, "", false, false, false, false, nil)
	if err != nil {
		log.Panicf("failed to start to consume [Queue %s]: %s", queue.Name, err)
	}
	log.Printf("Started to consume [Queue %s]", queue.Name)

	go func() {
		for delivery := range deliveries {
			var payload Payload

			err := json.Unmarshal(delivery.Body, &payload)
			if err != nil {
				log.Printf("failed to parse payload: %s", err)
				delivery.Nack(false, false)
				continue
			}

			err = notification.Validate(payload)
			if err != nil {
				log.Printf("failed to validate payload: %s", err)
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
}

func startProbe() {
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	go func() {
		err := http.ListenAndServe(":"+os.Getenv("PORT"), nil)
		if err != nil {
			log.Panicf("http server failed: %s", err)
		}
	}()

	log.Print("Started probe")
}
