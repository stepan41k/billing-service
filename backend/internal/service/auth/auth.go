package auth

import (
	"context"

	"github.com/stepan41k/billing-service/internal/models"
	"go.uber.org/zap"
)

type AuthRepository interface {
	GetPassword(ctx context.Context, login string) (string, error)
}

type AuthService struct {
	log *zap.Logger
	authRepository AuthRepository
}

func New(log *zap.Logger, authRepository AuthRepository) *AuthService {
	return &AuthService{
		log: log,
		authRepository: authRepository,
	}	
}

func (as *AuthService) Login(ctx context.Context, login string) (*models.NormalizedClient, error) {

}