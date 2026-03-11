package main

import (
	"log"

	"github.com/gorilla/mux"
	"github.com/stepan41k/testServer/pkg/api"
	"github.com/stepan41k/testServer/pkg/repository"
)

func main() {
	db, err := repository.New("postgres://postgres:admin@localhost:5432/cources")
	if err != nil {
		log.Fatal(err.Error())
	}
	api := api.New(mux.NewRouter(), db)
	api.Handle()
	log.Fatal(api.ListenAndServe("localhost:8090"))

}