package auth

import (
	"context"
	"errors"
	"fmt"

	"github.com/stepan41k/billing-service/internal/config"
	"github.com/stepan41k/billing-service/internal/domain"
	"github.com/stepan41k/billing-service/internal/lib/jwt"
	"github.com/stepan41k/billing-service/internal/models"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

type ProfileService interface {
	Get(ctx context.Context, login string) (*models.Client, error)
}

type AuthRepository interface {
	GetPassword(ctx context.Context, login string) (string, error)
}

type AuthService struct {
	cfg            config.TokenConfig
	log            *zap.Logger
	authRepository AuthRepository
	profileService ProfileService
}

func New(cfg config.TokenConfig, log *zap.Logger, authRepository AuthRepository, profileService ProfileService) *AuthService {
	return &AuthService{
		cfg:            cfg,
		log:            log,
		authRepository: authRepository,
		profileService: profileService,
	}
}

func (as *AuthService) Login(ctx context.Context, login, password string) (*models.Session, *models.Client, error) {
	const op = "service.auth.Login"
	log := as.log.With(
		zap.String("op", op),
	)

	// Get password hash from DB and check him
	passwordHash, err := as.authRepository.GetPassword(ctx, login)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			log.Debug("failed login: user not found")
			return nil, nil, domain.ErrInvalidCredentials
		}

		log.Error("failed to get password", zap.Error(err))
		return nil, nil, fmt.Errorf("%s: %w", op, err)
	}

	if err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password)); err != nil {
		return nil, nil, domain.ErrInvalidCredentials
	}

	// Get Profile Client
	client, err := as.profileService.Get(ctx, login)
	if err != nil {
		return nil, nil, fmt.Errorf("%s: %w", op, err)
	}

	access, refresh, err := jwt.GenerateToken(as.cfg, client.ID, client.Login)
	if err != nil {
		log.Error("failed to get tokens", zap.Error(err))
		return nil, nil, fmt.Errorf("%s: %w", op, err)
	}

	return &models.Session{
		AccessToken:  access,
		RefreshToken: refresh,
	}, client, nil
}

func (as *AuthService) RefreshToken(ctx context.Context, refreshToken string) (*models.Session, error) {
	const op = "service.auth.RefreshToken"
	log := as.log.With(
		zap.String("op", op),
	)

	access, refresh, err := jwt.RefreshToken(as.cfg, refreshToken)
	if err != nil {
		log.Error("failed to update refresh token", zap.Error(err))
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &models.Session{
		AccessToken:  access,
		RefreshToken: refresh,
	}, nil
}
