package processors

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestProcessBatchEmailValidate(t *testing.T) {
	t.Parallel()
	assert := assert.New(t)

	cases := map[string]struct {
		in   BatchEmailPayload
		want bool
	}{
		"pass": {
			in: BatchEmailPayload{
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
			},
			want: true,
		},
		"fail if emails is empty": {
			in: BatchEmailPayload{
				Emails: []EmailPayload{},
			},
			want: false,
		},
		"fail if to is empty": {
			in: BatchEmailPayload{
				Emails: []EmailPayload{
					{
						To:      "",
						Title:   "test",
						Content: "test",
					},
				},
			},
			want: false,
		},
		"fail if to is not email": {
			in: BatchEmailPayload{
				Emails: []EmailPayload{
					{
						To:      "test",
						Title:   "test",
						Content: "test",
					},
				},
			},
			want: false,
		},
		"fail if title is empty": {
			in: BatchEmailPayload{
				Emails: []EmailPayload{
					{
						To:      "test@example.com",
						Title:   "",
						Content: "test",
					},
				},
			},
			want: false,
		},
		"fail if content is empty": {
			in: BatchEmailPayload{
				Emails: []EmailPayload{
					{
						To:      "test@example.com",
						Title:   "test",
						Content: "",
					},
				},
			},
			want: false,
		},
	}

	for name, c := range cases {
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			got := c.in.Process() == nil

			assert.Equal(c.want, got, "got %v, want %v", got, c.want)
		})
	}
}
