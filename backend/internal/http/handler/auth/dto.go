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

type ProfileClient struct {
	ID          int64  `json:"id"`
	Login       string `json:"login"`
	Client      string `json:"client"`
	Contract    string `json:"contract"`
	PhoneNumber string `json:"phone_number"`
	Email       string `json:"email"`
}
