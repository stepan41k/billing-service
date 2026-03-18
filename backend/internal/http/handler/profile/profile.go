package profile

import (
	"context"
	"net/http"

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

	}
}

func (ph *ProfileHandler) CreateClient(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}
