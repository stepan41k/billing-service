package repository

import (
	"context"
	"github.com/stepan41k/testServer/pkg/models"
)

func (repo PGRepo) CreateGenre(newGenre models.Genre) (id int ,err error) {

	_, err = repo.pool.Exec(context.Background(), `
	INSERT INTO genres(genre)
	VALUES($1)
	RETURNING id;`,
	newGenre.Genre)
		
	return id, err

}

func (repo PGRepo) ReadGenre() () {
	
}

func (repo PGRepo) UpdateGenre() () {
	
}

func (repo PGRepo) DeleteGenre() () {
	
}

func (repo PGRepo) ReadGenreById() () {
	
}