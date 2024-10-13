package notification

import "testing"

// TestProcessEmailValidPayload tests Process with a valid email payload.
// It should not return an error.
func TestProcessEmailValidPayload(t *testing.T) {
	payload := EmailPayload{
		To:      "test@example.com",
		Title:   "test",
		Content: "test",
	}

	err := payload.Process()
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}

// TestProcessEmailEmptyTo tests Process with an empty 'To' field.
// It should return an error.
func TestProcessEmailEmptyTo(t *testing.T) {
	payload := EmailPayload{
		To:      "",
		Title:   "test",
		Content: "test",
	}

	err := payload.Process()
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

func TestProcessEmailInvalidTo(t *testing.T) {
	payload := EmailPayload{
		To:      "test",
		Title:   "test",
		Content: "test",
	}

	err := payload.Process()
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

// TestProcessEmailEmptyTitle tests Process with an empty 'Title' field.
// It should return an error.
func TestProcessEmailEmptyTitle(t *testing.T) {
	payload := EmailPayload{
		To:      "test@example.com",
		Title:   "",
		Content: "test",
	}

	err := payload.Process()
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

// TestProcessEmailEmptyContent tests Process with an empty 'Content' field.
// It should return an error.
func TestProcessEmailEmptyContent(t *testing.T) {
	payload := EmailPayload{
		To:      "test@example.com",
		Title:   "test",
		Content: "",
	}

	err := payload.Process()
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}
