package firebird

import (
	"context"
	"fmt"

	"github.com/stepan41k/billing-service/internal/models"
)

func (fr *FirebirdRepo) Get(ctx context.Context, login string) (*models.NormalizedClient, error) {
	const op = "repository.firebird.profile.Get"

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
	
	var normalizedClient models.NormalizedClient 

	row := tx.QueryRowContext(ctx, `
		SELECT ID
		FROM ACCOUNTS
		WHERE LOGIN = $1;
	`, login)

	err = row.Scan(&normalizedClient.ID)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	row = tx.QueryRowContext(ctx, `
		SELECT ACCOUNT_NUMBER, CONTRACT_NUMBER
		FROM CLIENT_PROFILES
		WHERE ACCOUNT_ID = $1;
	`, normalizedClient.ID)

	err = row.Scan(&normalizedClient.Client, &normalizedClient.Contract)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	row = tx.QueryRowContext(ctx, `
		SELECT PHONE_NUMBER, EMAIL
		FROM CONTACTS
		WHERE ACCOUNT_ID = $1;
	`, normalizedClient.ID)	

	err = row.Scan(&normalizedClient.PhoneNumber, &normalizedClient.Email)
	if err != nil {
		return nil, fmt.Errorf("%s: %w", op, err)
	}

	return &normalizedClient, nil
}

func (fr *FirebirdRepo) Create(ctx context.Context, newClient models.NewClient) (*models.NormalizedClient, error) {
	const op = "repository.firebird.profile.Create"

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

	var normalizedClient models.NormalizedClient

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
	`, normalizedClient.ID, newClient.Client, newClient.Contract)

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

	normalizedClient = models.NormalizedClient{
		ID: normalizedClient.ID,
		Login: newClient.Login,
		Client: newClient.Client,
		Contract: newClient.Contract,
		PhoneNumber: newClient.PhoneNumber,
		Email: newClient.Email,
	}

	return &normalizedClient, nil

}