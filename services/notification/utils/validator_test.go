package utils

import (
	"testing"
)

type payload struct {
	Name string `validate:"required"`
}

func TestValidate(t *testing.T) {
	t.Parallel()

	cases := map[string]struct {
		in   payload
		want bool
	}{
		"pass": {
			in:   payload{Name: "test"},
			want: true,
		},
		"fail": {
			in:   payload{Name: ""},
			want: false,
		},
	}

	for name, c := range cases {
		t.Run(name, func(t *testing.T) {
			t.Parallel()

			got := Validate(c.in) == nil

			if got != c.want {
				t.Errorf("got %v, want %v", got, c.want)
			}
		})
	}
}
