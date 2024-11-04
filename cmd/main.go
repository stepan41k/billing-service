package main

import (
	"fmt"
	"log"

	"github.com/stepan41k/testServer/pkg/models"
	"github.com/stepan41k/testServer/pkg/repository"
)

const connStr = "postgres://postgres:admin@localhost:5432/cources"

func main() {
	db, err := repository.New(connStr)
	if err != nil {
		log.Fatal(err.Error())
	}

	// item, err := db.GetBookByID(8)

	// if err != nil {
	// 	log.Fatal(err.Error())
	// }

	// item2, err := db.UpdateBook("Шинель", models.Book{GenreID: 2, AuthorID: 1, Name: "Идиот", Price: 200})
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }
	
	// fmt.Printf("Updated id %d:", item2.ID)

	// err = db.DeleteBook("Я идиот")
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }

	// var books []models.Book
	// books, err = db.GetBooks()
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }

	// for _, value := range books {
	// 	fmt.Printf("%d: %s, price: %d, author id: %d, genre id: %d\n", value.ID, value.Name, value.Price, value.AuthorID, value.GenreID)

	// }
	

	// book := models.Book{GenreID: 1, AuthorID: 1, Name: "Идиот", Price: 150}
	// err = db.NewBook(book)
	// if err != nil {
	// 	log.Fatal(err.Error())
	// }



	genre, err := db.CreateGenre(models.Genre{Genre: "Суета"})
	if err != nil {
		log.Fatal(err.Error())
	}

	fmt.Println(genre, err)


}