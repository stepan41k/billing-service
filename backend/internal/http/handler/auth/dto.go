package auth

type LoginRequset struct {
	Login    string `json:"login" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginResponse struct {
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	Profile      ProfileClient `json:"profile"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type RefreshTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type ProfileClient struct {
	ID             int64  `json:"id"`
	Login          string `json:"login"`
	IsReadOnly     bool   `json:"is_read_only"`
	ClientNumber   string `json:"client"`
	ContractNumber string `json:"contract"`
	PhoneNumber    string `json:"phone_number"`
	Email          string `json:"email"`
}
