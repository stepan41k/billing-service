package jwt

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stepan41k/billing-service/internal/config"
	"github.com/stepan41k/billing-service/internal/domain"
)

type Token string

var (
	TypeAccess  Token = "token_access"
	TypeRefresh Token = "token_refresh"
)

type Claim struct {
	UserID    int64  `json:"user_id"`
	Login     string `json:"login"`
	TokenType Token  `json:"token_type"`
	jwt.RegisteredClaims
}

func GenerateToken(cfg config.TokenConfig, userID int64, login string) (accessToken, refreshToken string, err error) {
	accessClaims := Claim{
		UserID:    userID,
		Login:     login,
		TokenType: TypeAccess,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(cfg.AccessTokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	newAccessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims).SignedString(cfg.AccessSecret)
	if err != nil {
		return "", "", fmt.Errorf("failed to sign access token: %w", err)
	}
	refreshClaims := Claim{
		UserID:    userID,
		Login:     login,
		TokenType: TypeAccess,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(cfg.RefreshTokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	newRefreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString(cfg.RefreshSecret)
	if err != nil {
		return "", "", fmt.Errorf("failed to sign refresh token: %w", err)
	}

	return newAccessToken, newRefreshToken, nil
}

func RefreshToken(cfg config.TokenConfig, oldRefreshToken string) (accessToken, refreshToken string, err error) {
	var expectedType = TypeRefresh

	var claim Claim
	token, err := jwt.ParseWithClaims(oldRefreshToken, &claim, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unsupporting signing method: %v", t.Header["alg"])
		}
		return cfg.RefreshSecret, nil
	})
	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return "", "", domain.ErrTokenExpired
		}
		return "", "", fmt.Errorf("%w: %w", domain.ErrInvalidToken, err)
	}

	if !token.Valid || claim.TokenType != expectedType {
		return "", "", domain.ErrInvalidToken
	}
	return GenerateToken(cfg, claim.UserID, claim.Login)
}

func ValidateAccessToken(cfg config.TokenConfig, accessToken string) (*Claim, error) {
	var expectedType = TypeAccess

	var claim Claim
	token, err := jwt.ParseWithClaims(accessToken, &claim, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unsupporting signing method: %v", t.Header["alg"])
		}
		return cfg.AccessSecret, nil
	})
	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, domain.ErrTokenExpired
		}
		return &claim, fmt.Errorf("%w: %w", domain.ErrInvalidToken, err)
	}

	if !token.Valid || claim.TokenType != expectedType {
		return nil, domain.ErrInvalidToken
	}

	return &claim, nil
}
