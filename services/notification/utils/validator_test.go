package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

type payload struct {
	Name string `validate:"required"`
}

func TestValidate(t *testing.T) {
	t.Parallel()
	assert := assert.New(t)

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

			assert.Equal(c.want, got, "got %v, want %v", got, c.want)
		})
	}
}
