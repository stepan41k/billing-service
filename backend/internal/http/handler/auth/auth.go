package auth

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/stepan41k/billing-service/internal/domain"
	"github.com/stepan41k/billing-service/internal/http/validation"
	"github.com/stepan41k/billing-service/internal/models"
	"go.uber.org/zap"
)

type AuthService interface {
	Login(ctx context.Context, login, password string) (*models.Session, *models.Client, error)
}

type AuthHandler struct {
	log         *zap.Logger
	authService AuthService
}

func New(log *zap.Logger, authService AuthService) *AuthHandler {
	return &AuthHandler{
		log:         log,
		authService: authService,
	}
}

func (ah *AuthHandler) Login(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req LoginRequset

		// Decode request
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			ah.log.Warn("invalid JSON", zap.Error(err))
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Validate
		if err := validation.Validate.Struct(&req); err != nil {
			ah.log.Warn("validation faild")
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Use Service
		token, client, err := ah.authService.Login(r.Context(), req.Login, req.Password)
		if err != nil {
			if errors.Is(err, domain.ErrInvalidCredentials) {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(
			LoginResponse{
				AccessToken:  token.AccessToken,
				RefreshToken: token.RefreshToken,
				Profile: ProfileClient{
					ID:             client.ID,
					Login:          client.Login,
					ClientNumber:   client.ClientNumber,
					ContractNumber: client.ContractNumber,
					PhoneNumber:    client.PhoneNumber,
					Email:          client.PhoneNumber,
				},
			},
		)
	}
}
