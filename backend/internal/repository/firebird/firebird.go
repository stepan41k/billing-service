package firebird

import (
	"database/sql"
	"fmt"
	"sync"
	"time"

	_ "github.com/nakagami/firebirdsql"
)

type FirebirdRepo struct {
	connStr string
	mu *sync.Mutex
	db *sql.DB
}

func NewDB(connStr string) (*FirebirdRepo) {
	return &FirebirdRepo{
		connStr: connStr,
		mu: &sync.Mutex{},
	}
}

func (fr *FirebirdRepo) Open() error {
	fr.mu.Lock()
	defer fr.mu.Unlock()

	db, err := sql.Open("firebirdsql", fr.connStr)
	if err != nil {
		return fmt.Errorf("failed to open databasse")
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(time.Hour)

	fr.db = db

	return nil
}

func (fr *FirebirdRepo) Close() error {
	fr.mu.Lock()
	defer fr.mu.Unlock()

	if fr.db != nil {
		err := fr.db.Close()
		if err != nil {
			return fmt.Errorf("failed to close databse connection: %w", err)
		}
	}

	return nil
}