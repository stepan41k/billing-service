package auth

import (
	"context"

	"github.com/stepan41k/billing-service/internal/models"
	"github.com/stepan41k/billing-service/internal/service/profile"
	"go.uber.org/zap"
)

type AuthRepository interface {
	GetPassword(ctx context.Context, login string) (string, error)
}

type AuthService struct {
	log            *zap.Logger
	authRepository AuthRepository
	profileService *profile.ProfileService
}

func New(log *zap.Logger, authRepository AuthRepository, profileService *profile.ProfileService) *AuthService {
	return &AuthService{
		log:            log,
		authRepository: authRepository,
		profileService: profileService,
	}
}

func (as *AuthService) Login(ctx context.Context, login string) (*models.NormalizedClient, error) {

}
