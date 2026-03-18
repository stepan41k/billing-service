package models

type NewClient struct {
	Login    string `json:"login"`
	Password string `json:"password"`
	ReadOnly bool   `json:"read_only"`

	Client      string `json:"client"`
	Contract    string `json:"contract"`
	PhoneNumber string `json:"phone_number" validate:"required"`
	Email       string `json:"email" validate:"email,required"`
}

type NormalizedClient struct {
	ID          int64  `json:"id"`
	Login       string `json:"login"`
	Client      string `json:"client"`
	Contract    string `json:"contract"`
	PhoneNumber string `json:"phone_number"`
	Email       string `json:"email"`
}

type Client struct {
	ID             int64
	Login          string
	IsReadOnly     bool
	ClientNumber   string
	ContractNumber string
	PhoneNumber    string
	Email          string
}
