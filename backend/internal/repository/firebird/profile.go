package firebird

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/stepan41k/billing-service/internal/domain"
	"github.com/stepan41k/billing-service/internal/models"
)

func (fr *FirebirdRepo) GetProfile(ctx context.Context, login string) (*models.Client, error) {
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

	row := tx.QueryRowContext(ctx, `
		SELECT ID
		FROM ACCOUNTS
		WHERE LOGIN = $1;
	`, login)

	err = row.Scan(&client.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("%s: %w", op, domain.ErrUserNotFound)
		}
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	row = tx.QueryRowContext(ctx, `
		SELECT ACCOUNT_NUMBER, CONTRACT_NUMBER
		FROM CLIENT_PROFILES
		WHERE ACCOUNT_ID = $1;
	`, client.ID)

	err = row.Scan(&client.ClientNumber, &client.ContractNumber)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	row = tx.QueryRowContext(ctx, `
		SELECT PHONE_NUMBER, EMAIL
		FROM CONTACTS
		WHERE ACCOUNT_ID = $1;
	`, client.ID)

	err = row.Scan(&client.PhoneNumber, &client.Email)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &client, nil
}

func (fr *FirebirdRepo) CreateProfile(ctx context.Context, newClient models.CreateClient) (*models.Client, error) {
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

	var normalizedClient models.Client

	row := tx.QueryRowContext(ctx, `
		INSERT INTO ACCOUTNS (LOGIN, PASSWORD_HASH)
		VALUES($1, $2)
		RETURNING ID;
	`)

	err = row.Scan(&normalizedClient.ID)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	_, err = tx.ExecContext(ctx, `
		INSERT INTO CLIENT_PROFILES(ACCOUNT_ID, ACCOUNT_NUMBER, CONTACT_NUMBER)
		VALUES($1, $2, $3);
	`, normalizedClient.ID, newClient.ClientNumber, newClient.ContractNumber)

	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	_, err = tx.ExecContext(ctx, `
		INSERT INTO CONTACTS(ACCOUNT_ID, PHONE_NUMBER, EMAIL)
		VALUES ($1, $2, $3)
	`, normalizedClient.ID, newClient.PhoneNumber, newClient.Email)

	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	normalizedClient = models.Client{
		ID:             normalizedClient.ID,
		Login:          newClient.Login,
		ClientNumber:   newClient.ClientNumber,
		ContractNumber: newClient.ContractNumber,
		PhoneNumber:    newClient.PhoneNumber,
		Email:          newClient.Email,
	}

	return &normalizedClient, nil

}
