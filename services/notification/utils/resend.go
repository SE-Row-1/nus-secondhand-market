package utils

import (
	"os"
	"sync"

	"github.com/resend/resend-go/v2"
)

type singleton struct {
	instance *resend.Client
}

var s *singleton

var once sync.Once

func NewResendClient() *resend.Client {
	once.Do(func() {
		s = &singleton{
			instance: resend.NewClient(os.Getenv("RESEND_API_KEY")),
		}
	})
	return s.instance
}
