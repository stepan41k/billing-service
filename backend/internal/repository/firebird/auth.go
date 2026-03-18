package firebird

import (
	"context"
	"fmt"
)

func (fr *FirebirdRepo) GetPassword(ctx context.Context, login string) (string, error) {
	const op = "repository.firebird.auth.GetPassword"

	tx, err := fr.db.BeginTx(ctx, nil)
	if err != nil {
		return "", fmt.Errorf("%s: %w", op, err)
	}

	defer func() {
		if err != nil {
			tx.Rollback()
			return
		}

		commitErr := tx.Commit()
		if commitErr != nil {
			err = fmt.Errorf("%s: %w", op, commitErr)
		}
	}()

	var password string

	row := fr.db.QueryRowContext(ctx, `
		SELECT PASSWORD_HASH
		FROM ACCOUNTS
		WHERE LOGIN = $1;
	`, login)

	err = row.Scan(&password)
	if err != nil {
		return "", fmt.Errorf("%s: %w", op, err)
	}

	return password, nil
}