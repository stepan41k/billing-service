package profile

import (
	"context"
	"fmt"

	"github.com/stepan41k/billing-service/internal/models"
	"go.uber.org/zap"
)

type ProfileRepository interface {
	GetProfile(ctx context.Context, login string) (*models.Client, error)
	CreateProfile(ctx context.Context, newClient models.CreateClient) (*models.Client, error)
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

func (ps *ProfileService) Get(ctx context.Context, login string) (*models.Client, error) {
	const op = "service.profile.Get"
	log := ps.log.With(zap.String("op", op))

	client, err := ps.profileRepository.GetProfile(ctx, login)
	if err != nil {
		log.Error("failed to get client", zap.Error(err))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return client, nil
}

func (ps *ProfileService) Create(ctx context.Context, newClient models.CreateClient) (*models.Client, error) {
	const op = "service.profile.Create"
	_ = ps.log.With(zap.String("op", op))

	return nil, nil
}
