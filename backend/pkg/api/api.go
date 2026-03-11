package api

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/stepan41k/testServer/pkg/repository"
)

type api struct {
	r *mux.Router
	db *repository.PGRepo
}

func New(router *mux.Router, db *repository.PGRepo) *api {
	return &api{r: router, db: db}
}

func (api *api) Handle() {
	api.r.HandleFunc("/api/books", api.books).Queries("id", "{id}")
	api.r.HandleFunc("/api/books", api.books).Queries("name", "{name}")
	api.r.HandleFunc("/api/books", api.books)
}

func (api *api) ListenAndServe(addr string) error {
	return http.ListenAndServe(addr, api.r)
}