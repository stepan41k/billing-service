package profile

import (
	"context"
	"net/http"

	"go.uber.org/zap"
)

type ProfileService interface {
	Get()
	Create()
}

type ProfileHandler struct {
	log *zap.Logger
	profileService ProfileService
}

func New(log *zap.Logger, profileService ProfileService) *ProfileHandler {
	return &ProfileHandler{
		log: log,
		profileService: profileService,
	}
}

func (ph *ProfileHandler) Get(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func (ph *ProfileHandler) Create(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		
	}
}