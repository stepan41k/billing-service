package profile

import (
	"context"

	"github.com/stepan41k/billing-service/internal/models"
	"go.uber.org/zap"
)

type ProfileRepository interface {
	Create(ctx context.Context, newCLient models.NewClient) (*models.NormalizedClient, error)
	GetNormalized(ctx context.Context, login string) (*models.NormalizedClient, error)
}

type ProfileService struct {
	log *zap.Logger
	profileRepository ProfileRepository
}

func New(log *zap.Logger, profileRepository ProfileRepository) *ProfileService {
	return &ProfileService{
		log: log,
		profileRepository: profileRepository,
	}	
}

func (ps *ProfileService) GetClient(ctx context.Context, login string) (*models.NormalizedClient, error) {

}

func (ps *ProfileService) CreateClient(ctx context.Context, newClient models.NewClient) (*models.NormalizedClient, error) {

}

