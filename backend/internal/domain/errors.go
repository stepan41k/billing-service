package domain

import "errors"

var (
	ErrInvalidToken = errors.New("Invalid token")
	ErrTokenExpired = errors.New("Expired token")
)
