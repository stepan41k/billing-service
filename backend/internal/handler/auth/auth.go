package auth

import (
	"context"
	"net/http"

	"go.uber.org/zap"
)

type AuthService interface {
	Login()
}

type AuthHandler struct {
	log *zap.Logger
	authService AuthService
}

func New(log *zap.Logger, authService AuthService) *AuthHandler {
	return &AuthHandler{
		log: log,
		authService: authService,
	}
}

func (ah *AuthHandler) Login(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}