package processors

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/resend/resend-go/v2"
	"nshm.shop/notification/utils"
)

type BatchEmailPayload struct {
	Emails []EmailPayload `json:"emails" validate:"required,gt=0,dive,required"`
}

func (payload BatchEmailPayload) Process() error {
	err := utils.Validate(payload)
	if err != nil {
		return err
	}

	emails := payload.Emails

	if os.Getenv("GO_ENV") != "production" {
		for _, email := range emails {
			log.Printf("sent emails:\n[to]\n%s\n[title]\n%s\n[content]\n%s\n", email.To, email.Title, email.Content)
		}

		return nil
	}

	client := resend.NewClient(os.Getenv("RESEND_API_KEY"))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	sendEmailRequests := make([]*resend.SendEmailRequest, 0)
	for _, email := range emails {
		sendEmailRequests = append(sendEmailRequests, &resend.SendEmailRequest{
			From:    "NUS Second-Hand Market <notifications@nshm.store>",
			To:      []string{email.To},
			Subject: email.Title,
			Html:    email.Content,
		})
	}

	sent, err := client.Batch.SendWithContext(ctx, sendEmailRequests)
	if err != nil {
		return err
	}

	log.Printf("sent emails: %s\n", sent.Data)
	return nil
}
