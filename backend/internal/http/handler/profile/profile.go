package profile

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/stepan41k/billing-service/internal/domain"
	"github.com/stepan41k/billing-service/internal/models"
	"go.uber.org/zap"
)

type ProfileService interface {
	Get(ctx context.Context, login string) (*models.Client, error)
	Create(ctx context.Context, newCLient models.CreateClient) (*models.Client, error)
}

type ProfileHandler struct {
	log            *zap.Logger
	profileService ProfileService
}

func New(log *zap.Logger, profileService ProfileService) *ProfileHandler {
	return &ProfileHandler{
		log:            log,
		profileService: profileService,
	}
}

func (ph *ProfileHandler) GetClient(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authInfo, ok := domain.AuthFromContext(r.Context())
		if ok != true {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		// Use Service
		client, err := ph.profileService.Get(r.Context(), authInfo.Login)
		if err != nil {
			if errors.Is(err, domain.ErrUserNotFound) {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(
			ClientResponse{
				ID:             client.ID,
				Login:          client.Login,
				IsReadOnly:     client.IsReadOnly,
				ClientNumber:   client.ClientNumber,
				ContractNumber: client.ContractNumber,
				PhoneNumber:    client.PhoneNumber,
				Email:          client.PhoneNumber,
			},
		)
	}
}

func (ph *ProfileHandler) CreateClient(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
