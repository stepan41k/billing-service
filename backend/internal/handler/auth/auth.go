package auth

import (
	"context"
	"net/http"

	"github.com/stepan41k/billing-service/internal/models"
	"go.uber.org/zap"
)

type AuthService interface {
	Login(ctx context.Context, login string) (*models.NormalizedClient, error)
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