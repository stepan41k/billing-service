package models

type ClientProfile struct {
    AccountID      int64  `db:"ACCOUNT_ID"`
    AccountNumber  string `db:"ACCOUNT_NUMBER"` 
    ContractNumber string `db:"CONTRACT_NUMBER"` 
}