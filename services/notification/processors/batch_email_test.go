package processors

import "testing"

// TestProcessBatchEmailValidPayload tests Process with a valid email payload.
// It should not return an error.
func TestProcessBatchEmailValidPayload(t *testing.T) {
	payload := BatchEmailPayload{
		Emails: []EmailPayload{
			{
				To:      "test1@example.com",
				Title:   "test1",
				Content: "test1",
			},
			{
				To:      "test2@example.com",
				Title:   "test2",
				Content: "test2",
			},
		},
	}

	err := payload.Process()
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}

// TestProcessBatchEmailEmptyList tests Process with an empty 'Emails' field.
// It should return an error.
func TestProcessBatchEmailEmptyList(t *testing.T) {
	payload := BatchEmailPayload{
		Emails: []EmailPayload{},
	}

	err := payload.Process()
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

// TestProcessBatchEmailEmptyTo tests Process with an empty 'To' field.
// It should return an error.
func TestProcessBatchEmailEmptyTo(t *testing.T) {
	payload := BatchEmailPayload{
		Emails: []EmailPayload{
			{
				To:      "",
				Title:   "test",
				Content: "test",
			},
		},
	}

	err := payload.Process()
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

// TestProcessBatchEmailInvalidTo tests Process with an invalid 'To' field.
// It should return an error.
func TestProcessBatchEmailInvalidTo(t *testing.T) {
	payload := BatchEmailPayload{
		Emails: []EmailPayload{
			{
				To:      "test",
				Title:   "test",
				Content: "test",
			},
		},
	}

	err := payload.Process()
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

// TestProcessBatchEmailEmptyTitle tests Process with an empty 'Title' field.
// It should return an error.
func TestProcessBatchEmailEmptyTitle(t *testing.T) {
	payload := BatchEmailPayload{
		Emails: []EmailPayload{
			{
				To:      "test@example.com",
				Title:   "",
				Content: "test",
			},
		},
	}

	err := payload.Process()
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}

// TestProcessBatchEmailEmptyContent tests Process with an empty 'Content' field.
// It should return an error.
func TestProcessBatchEmailEmptyContent(t *testing.T) {
	payload := BatchEmailPayload{
		Emails: []EmailPayload{
			{
				To:      "test@example.com",
				Title:   "test",
				Content: "",
			},
		},
	}

	err := payload.Process()
	if err == nil {
		t.Errorf("expected error, got nil")
	}
}
