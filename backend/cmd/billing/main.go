package main

import (
	"fmt"

	"github.com/go-chi/chi/v5"
	"github.com/stepan41k/billing-service/internal/repository/firebird"
)

func main() {

	connStr := fmt.Sprintf()

	db := firebird.NewDB()
	handler :=
		service
	router := chi.NewRouter()

	router.Route("/api", func(r chi.Router) {
		r.Post("/login")
		r.Post("/profile")
	})
}
