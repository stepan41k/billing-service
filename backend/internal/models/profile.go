package models

type Client struct {
	ID             int64
	Login          string
	IsReadOnly     bool
	ClientNumber   string
	ContractNumber string
	PhoneNumber    string
	Email          string
}

type CreateClient struct {
	Login          string
	Password       string
	IsReadOnly     bool
	ClientNumber   string
	ContractNumber string
	PhoneNumber    string
	Email          string
}
