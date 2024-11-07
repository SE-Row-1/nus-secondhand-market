package notification

import "github.com/go-playground/validator/v10"

var singleton = validator.New(validator.WithRequiredStructEnabled())

func Validate(payload interface{}) error {
	return singleton.Struct(payload)
}
