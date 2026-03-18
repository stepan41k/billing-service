package profile

import (
	"context"
	"fmt"

	"github.com/stepan41k/billing-service/internal/models"
	"go.uber.org/zap"
)

type ProfileRepository interface {
	Create(ctx context.Context, newCLient models.NewClient) (*models.NormalizedClient, error)
	GetNormalized(ctx context.Context, login string) (*models.NormalizedClient, error)
}

type ProfileService struct {
	log               *zap.Logger
	profileRepository ProfileRepository
}

func New(log *zap.Logger, profileRepository ProfileRepository) *ProfileService {
	return &ProfileService{
		log:               log,
		profileRepository: profileRepository,
	}
}

func (ps *ProfileService) GetClient(ctx context.Context, login string) (*models.NormalizedClient, error) {
	const op = "service.profile.GetClient"
	log := ps.log.With(
		zap.String("op", op),
		zap.String("login", login),
	)

	normalizedClient, err := ps.profileRepository.GetNormalized(ctx, login)
	if err != nil {
		log.Error("failed to get client", zap.Error(err))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return normalizedClient, nil
}

func (ps *ProfileService) CreateClient(ctx context.Context, newClient models.NewClient) (*models.NormalizedClient, error) {
	return nil, nil
}
