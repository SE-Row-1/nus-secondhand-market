package processors

import "testing"

func TestProcessEmailValidate(t *testing.T) {
	t.Parallel()

	cases := map[string]struct {
		in   EmailPayload
		want bool
	}{
		"pass": {
			in: EmailPayload{
				To:      "test@example.com",
				Title:   "test",
				Content: "test",
			},
			want: true,
		},
		"fail if to is empty": {
			in: EmailPayload{
				To:      "",
				Title:   "test",
				Content: "test",
			},
			want: false,
		},
		"fail if to is not email": {
			in: EmailPayload{
				To:      "test",
				Title:   "test",
				Content: "test",
			},
			want: false,
		},
		"fail if title is empty": {
			in: EmailPayload{
				To:      "test@example.com",
				Title:   "",
				Content: "test",
			},
			want: false,
		},
		"fail if content is empty": {
			in: EmailPayload{
				To:      "test@example.com",
				Title:   "test",
				Content: "",
			},
			want: false,
		},
	}

	for name, c := range cases {
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			got := c.in.Process() == nil

			if got != c.want {
				t.Errorf("got %v, want %v", got, c.want)
			}
		})
	}
}
