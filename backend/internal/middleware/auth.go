package middleware

import (
	"errors"
	"net/http"
	"strings"

	"github.com/stepan41k/billing-service/internal/config"
	"github.com/stepan41k/billing-service/internal/domain"
	"github.com/stepan41k/billing-service/internal/lib/jwt"
	"go.uber.org/zap"
)

func AuthMiddleware(log *zap.Logger, cfg config.TokenConfig) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Authorization header is required", http.StatusUnauthorized)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
				return
			}

			_, err := jwt.ValidateAccessToken(cfg, parts[1])
			if err != nil {
				if errors.Is(err, domain.ErrTokenExpired) {
					http.Error(w, "token expired", http.StatusUnauthorized)
					return
				}
				if errors.Is(err, domain.ErrInvalidToken) {
					http.Error(w, "invalid token", http.StatusUnauthorized)
					return
				}

				log.Error("failed to parse token",
					zap.String("ip", r.RemoteAddr),
					zap.Error(err),
				)
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			next.ServeHTTP(w, r)
		})
	}

}
