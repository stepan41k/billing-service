package profile

import (
	"go.uber.org/zap"
)

type ProfileRepository interface {
	Create()
	Get()
}

type ProfileService struct {
	log *zap.Logger
	profileRepository ProfileRepository
}

func New(log *zap.Logger, profileRepository ProfileRepository) *ProfileService {
	return &ProfileService{
		log: log,
		profileRepository: profileRepository,
	}	
}

func (ps *ProfileService) Get() {

}

func (ps *ProfileService) Create() {
	
}

