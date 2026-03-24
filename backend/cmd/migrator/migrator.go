package migrator

import (
	"fmt"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/nakagami/firebirdsql"
)



func Migrate() {
    dsn := os.Getenv("DATABASE_URL")
    // Путь к папке, например, "/app/migrations"	
    migrationsPath := os.Getenv("MIGRATIONS_PATH") 

    fmt.Printf("try to up migrate, migrate path: %s", migrationsPath)

    // В golang-migrate путь должен начинаться с file://
    m, err := migrate.New("file://"+migrationsPath, "firebirdsql://"+dsn)
    if err != nil {
        log.Fatal(err)
    }

    if err := m.Up(); err != nil && err != migrate.ErrNoChange {
        log.Fatal(err)
    }
}