package models

import (
	"time"
)

type Account struct {
    ID           int64     `db:"ID"`
    Login        string    `db:"LOGIN"`
    PasswordHash string    `db:"PASSWORD_HASH"`
    IsReadOnly   bool      `db:"IS_READ_ONLY"`
    UpdatedAt    time.Time `db:"UPDATED_AT"`
}
