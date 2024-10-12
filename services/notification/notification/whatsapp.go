package notification

import "log"

type WhatsappPayload struct {
	To      string `json:"to"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

func (payload WhatsappPayload) Process() error {
	log.Printf("To: %s", payload.To)
	log.Printf("Title: %s", payload.Title)
	log.Printf("Content: %s", payload.Content)

	return nil
}
