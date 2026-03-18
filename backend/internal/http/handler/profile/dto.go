package profile

type ClientResponse struct {
	ID             int64  `json:"id"`
	Login          string `json:"login"`
	IsReadOnly     bool   `json:"is_read_only"`
	ClientNumber   string `json:"client"`
	ContractNumber string `json:"contract"`
	PhoneNumber    string `json:"phone_number"`
	Email          string `json:"email"`
}

type CreateClientRequest struct {
	Login          string `json:"login" validate:"required"`
	Passoword      string `json:"password" validate:"required"`
	IsReadOnly     bool   `json:"is_read_only" validate:"required"`
	ClientNumber   string `json:"client_number" validate:"requierd"`
	ContractNumber string `json:"contract_number" validate:"required"`
	PhoneNumber    string `json:"phone_number" validate:"required"`
	Email          string `json:"email" validate:"required"`
}
