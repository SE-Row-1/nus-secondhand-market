package utils

import "github.com/go-playground/validator/v10"

var singleton *validator.Validate

func init() {
	singleton = validator.New()
}

func Validate(payload interface{}) error {
	return singleton.Struct(payload)
}
