package firebird

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/stepan41k/billing-service/internal/domain"
)

func (fr *FirebirdRepo) GetPassword(ctx context.Context, login string) (string, error) {
	const op = "repository.firebird.auth.GetPassword"

	var password string
	row := fr.db.QueryRowContext(ctx, `
		SELECT "PASSWORD_HASH"
		FROM "ACCOUNTS"
		WHERE "LOGIN" = ?;
	`, login)

	err := row.Scan(&password)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", domain.ErrUserNotFound
		}
		return "", fmt.Errorf("%s: %w", op, err)
	}

	return password, nil
}
