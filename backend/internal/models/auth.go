package models

type LoginClient struct {
	Login    string `json:"login" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type TokenClient struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type ResponseLoginСlient struct {
	TokenClient TokenClient      `json:"token_client"`
	Client      NormalizedClient `json:"client"`
}
