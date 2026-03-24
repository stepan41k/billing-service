package firebird

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/stepan41k/billing-service/internal/domain"
	"github.com/stepan41k/billing-service/internal/models"
)

func (fr *FirebirdRepo) GetProfile(ctx context.Context, login string) (c *models.Client, err error) {
	const op = "repository.firebird.GetProfile"

	tx, err := fr.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	defer func() {
		if err != nil {
			_ = tx.Rollback()
			return
		}

		commitErr := tx.Commit()
		if commitErr != nil {
			err = fmt.Errorf("%s: %w", op, err)
		}
	}()

	var client models.Client
	client.Login = login

	row := tx.QueryRowContext(ctx, `
		SELECT "ID"
		FROM "ACCOUNTS"
		WHERE "LOGIN" = ?;
	`, login)

	err = row.Scan(&client.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("%s: %w", op, domain.ErrUserNotFound)
		}
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	row = tx.QueryRowContext(ctx, `
		SELECT "ACCOUNT_NUMBER", "CONTRACT_NUMBER"
		FROM "CLIENT_PROFILES"
		WHERE "ACCOUNT_ID" = ?;
	`, client.ID)

	err = row.Scan(&client.ClientNumber, &client.ContractNumber)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	row = tx.QueryRowContext(ctx, `
		SELECT "PHONE_NUMBER", "EMAIL"
		FROM "CONTACTS"
		WHERE "ACCOUNT_ID" = ?;
	`, client.ID)

	err = row.Scan(&client.PhoneNumber, &client.Email)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &client, nil
}

func (fr *FirebirdRepo) CreateProfile(ctx context.Context, newClient models.CreateClient) (c *models.Client, err error) {
	const op = "repository.firebird.CreateProfile"

	tx, err := fr.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	defer func() {
		if err != nil {
			_ = tx.Rollback()
			return
		}

		commitErr := tx.Commit()
		if commitErr != nil {
			err = fmt.Errorf("%s: %w", op, commitErr)
		}
	}()

	var client models.Client

	row := tx.QueryRowContext(ctx, `
		INSERT INTO "ACCOUNTS" ("LOGIN", "PASSWORD_HASH")
		VALUES(?, ?)
		RETURNING ID;
	`, newClient.Login, []byte(newClient.Password))

	err = row.Scan(&client.ID)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	_, err = tx.ExecContext(ctx, `
		INSERT INTO "CLIENT_PROFILES"("ACCOUNT_ID", "ACCOUNT_NUMBER", "CONTRACT_NUMBER")
		VALUES(?, ?, ?);
	`, client.ID, newClient.ClientNumber, newClient.ContractNumber)

	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	_, err = tx.ExecContext(ctx, `
		INSERT INTO "CONTACTS"("ACCOUNT_ID", "PHONE_NUMBER", "EMAIL")
		VALUES (?, ?, ?)
	`, client.ID, newClient.PhoneNumber, newClient.Email)

	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	client.Login = newClient.Login
	client.ClientNumber = newClient.ClientNumber
	client.ContractNumber = newClient.ContractNumber
	client.PhoneNumber = newClient.PhoneNumber
	client.Email = newClient.Email

	return &client, nil
}
