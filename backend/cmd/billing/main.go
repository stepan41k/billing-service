package main

import (
	"fmt"
	"log"

	"github.com/go-chi/chi/v5"
	"github.com/stepan41k/billing-service/internal/repository/firebird"
	"github.com/stepan41k/testServer/pkg/api"
	"github.com/stepan41k/testServer/pkg/repository"
)

func main() {
	
	connStr := fmt.Sprintf()

	db := firebird.NewDB()
	handler := 
	service
	router := chi.NewRouter()

	router.Route("api", func(r chi.Router) {
		r.Post("/login", )
		r.Post("/profile")
	})
}
