package models

type Contact struct {
    AccountID   int64  `db:"ACCOUNT_ID"`
    PhoneNumber string `db:"PHONE_NUMBER"`
    Email       string `db:"EMAIL"`
}