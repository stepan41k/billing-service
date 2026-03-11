package repository

import(
	"context"
	"github.com/stepan41k/testServer/pkg/models"
)

func (repo PGRepo) CreateAuthor(newAuthor models.Author) (id int, err error) {
	
	_, err = repo.pool.Exec(context.Background(), `
	INSERT INTO authors(name)
	VALUES($1)
	RETURNING id
	`, newAuthor.Name)

	return id, err
}

func (repo PGRepo) ReadAuthor() () {
	
}

func (repo PGRepo) UpdateAuthor() () {
	
}

func (repo PGRepo) DeleteAuthor() () {
	
}

func (repo PGRepo) ReadAuthorById() () {
	
}