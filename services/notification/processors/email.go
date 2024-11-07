package processors

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/resend/resend-go/v2"
	"nshm.store/notification/utils"
)

type EmailPayload struct {
	To      string `json:"to" validate:"required,email"`
	Title   string `json:"title" validate:"required"`
	Content string `json:"content" validate:"required"`
}

func (payload EmailPayload) Process() error {
	err := utils.Validate(payload)
	if err != nil {
		return err
	}

	if os.Getenv("GO_ENV") != "production" {
		log.Printf("sent email:\n[to]\n%s\n[title]\n%s\n[content]\n%s\n", payload.To, payload.Title, payload.Content)
		return nil
	}

	client := resend.NewClient(os.Getenv("RESEND_API_KEY"))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	sent, err := client.Emails.SendWithContext(ctx, &resend.SendEmailRequest{
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
