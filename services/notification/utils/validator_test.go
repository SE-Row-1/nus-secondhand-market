package utils

import "testing"

type testStruct struct {
	Name string `validate:"required"`
}

// TestValidatorSucceed tests Validate with a valid struct.
// It should not return an error.
func TestValidatorSucceed(t *testing.T) {
	err := Validate(testStruct{Name: "test"})
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}

// TestValidatorFail tests Validate with an invalid struct.
// It should return an error.
func TestValidatorFail(t *testing.T) {
	err := Validate(testStruct{})
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}
