package notification

import (
	"context"
	"log"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/resend/resend-go/v2"
	"nshm.shop/notification/utils"
)

type EmailPayload struct {
	To      string `json:"to" validate:"required,email"`
	Title   string `json:"title" validate:"required"`
	Content string `json:"content" validate:"required"`
}

var validate *validator.Validate

func (payload EmailPayload) Process() error {
	validate = validator.New()
	err := validate.Struct(payload)
	if err != nil {
		return err
	}

	if os.Getenv("GO_ENV") != "production" {
		log.Printf("sent email:\n[to]\n%s\n[title]\n%s\n[content]\n%s\n", payload.To, payload.Title, payload.Content)
		return nil
	}

	client := utils.NewResendClient()

	sent, err := client.Emails.SendWithContext(context.TODO(), &resend.SendEmailRequest{
		From:    "NUS Second-Hand Market <notifications@nshm.store>",
		To:      []string{payload.To},
		Subject: payload.Title,
		Html:    payload.Content,
	})

	if err != nil {
		return err
	}

	log.Printf("sent email: %s\n", sent.Id)

	return nil
}
