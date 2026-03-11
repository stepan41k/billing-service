package jwt

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stepan41k/billing-service/internal/config"
)

type Claim struct {
	UserID    int    `json:"user_id"`
	Login     string `json:"login"`
	TokenType string `json:"token_type"`
	jwt.RegisteredClaims
}

func GenerateToken(cfg config.TokenConfig, userID int, login string) (accessToken, refreshToken string, err error) {
	accessClaims := Claim{
		UserID:    userID,
		Login:     login,
		TokenType: "token_access",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(cfg.AccessTokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	newAccessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims).SignedString(cfg.AccessSecret)
	if err != nil {
		return "", "", fmt.Errorf("failed to generate access token: %w", err)
	}
	refreshClaims := Claim{
		UserID:    userID,
		Login:     login,
		TokenType: "token_refresh",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(cfg.RefreshTokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	newRefreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString(cfg.RefreshSecret)
	if err != nil {
		return "", "", fmt.Errorf("failed to genereate refresh token: %w", err)
	}

	return newAccessToken, newRefreshToken, nil
}

func RefreshToken(cfg config.TokenConfig, oldRefreshToken string) (accessToken, refreshToken string, err error) {
	var claim Claim
	token, err := jwt.ParseWithClaims(oldRefreshToken, &claim, func(t *jwt.Token) (any, error) {
		return cfg.RefreshSecret, nil
	})
	if err != nil {
		return "", "", fmt.Errorf("failed parse refresh token: %w", err)
	}
	if !token.Valid {
		return "", "", fmt.Errorf("failed validate refresh token: %w", err)
	}
	return GenerateToken(cfg, claim.UserID, claim.Login)
}

func ValidateAccessToken(cfg config.TokenConfig, accessToken string) (Claim, error) {
	var claim Claim
	token, err := jwt.ParseWithClaims(accessToken, &claim, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unsupporting signing method: %v", t.Header["alg"])
		}
		return cfg.AccessSecret, nil
	})
	if err != nil {
		return claim, fmt.Errorf("failed parce access token: %w", err)
	}
	if !token.Valid {
		return claim, fmt.Errorf("failed validate access token: %w", err)
	}

	return claim, nil
}
