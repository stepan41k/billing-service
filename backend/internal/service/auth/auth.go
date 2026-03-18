package auth

import (
	"context"
	"errors"
	"fmt"

	"github.com/stepan41k/billing-service/internal/config"
	"github.com/stepan41k/billing-service/internal/domain"
	"github.com/stepan41k/billing-service/internal/lib/jwt"
	"github.com/stepan41k/billing-service/internal/models"
	"github.com/stepan41k/billing-service/internal/service/profile"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

type AuthRepository interface {
	GetPassword(ctx context.Context, login string) (string, error)
}

type AuthService struct {
	cfg            config.TokenConfig
	log            *zap.Logger
	authRepository AuthRepository
	profileService *profile.ProfileService
}

func New(cfg config.TokenConfig, log *zap.Logger, authRepository AuthRepository, profileService *profile.ProfileService) *AuthService {
	return &AuthService{
		cfg:            cfg,
		log:            log,
		authRepository: authRepository,
		profileService: profileService,
	}
}

func (as *AuthService) Login(ctx context.Context, login, password string) (*models.TokenClient, *models.NormalizedClient, error) {
	const op = "repository.auth.Login"
	log := as.log.With(
		zap.String("op", op),
		zap.String("login", login),
	)

	// Get password hash from DB and check him
	passwordHash, err := as.authRepository.GetPassword(ctx, login)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			log.Warn("failed login: user not found")
			return nil, nil, domain.ErrInvalidCredentials
		}

		log.Error("failed to get password", zap.Error(err))
		return nil, nil, fmt.Errorf("%s: %w", op, err)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password)); err != nil {
		return nil, nil, domain.ErrInvalidCredentials
	}

	// Get Profile Client
	normalizedClient, err := as.profileService.GetClient(ctx, login)
	if err != nil {
		return nil, nil, fmt.Errorf("%s: %w", op, err)
	}

	access, refresh, err := jwt.GenerateToken(as.cfg, normalizedClient.ID, normalizedClient.Login)
	if err != nil {
		log.Error("failed to get tokens", zap.Error(err))
		return nil, nil, fmt.Errorf("%s: %w", op, err)
	}

	return &models.TokenClient{
		AccessToken:  access,
		RefreshToken: refresh,
	}, normalizedClient, nil
}
