package migrator

import (
	"fmt"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/nakagami/firebirdsql"
    _ "github.com/golang-migrate/migrate/v4/database/firebird" // Драйвер БД
    _ "github.com/golang-migrate/migrate/v4/source/file"     // ЭТОГО ИМПОРТА НЕ ХВАТАЛО
)



func Migrate() {
    dsn := os.Getenv("DATABASE_URL")

    fmt.Println(dsn)

    migrationsPath := os.Getenv("MIGRATIONS_PATH")
    sourceURL := "file://"+migrationsPath
    
    fmt.Printf("try to up migrate, source url: %s\n", sourceURL)
    fmt.Printf("try to up migrate, migrate path: %s\n", migrationsPath)

    m, err := migrate.New(sourceURL, "firebirdsql://SYSDBA:masterkey@192.168.1.22:3050/C:/Data/maximadb.fdb")
    if err != nil {
        log.Fatal(err)
    }

    if err := m.Up(); err != nil && err != migrate.ErrNoChange {
        log.Fatal(err)
    }
}