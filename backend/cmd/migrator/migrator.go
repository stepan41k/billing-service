package migrator

import (
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/firebird" // Драйвер БД
	_ "github.com/golang-migrate/migrate/v4/source/file"       // ЭТОГО ИМПОРТА НЕ ХВАТАЛО
	_ "github.com/nakagami/firebirdsql"
	"github.com/stepan41k/billing-service/internal/config"
)

func Migrate() {
	cfgFireBird := config.MustLoadMigration()
	migrationPath := os.Getenv("MIGRATIONS_PATH")
	if migrationPath == "" {
		migrationPath = "/app/migrations"
	}

	sourceURL := "file://" + migrationPath
	databaseURL := "firebirdsql://" + cfgFireBird.DSN()

	log.Printf("INFO: FireBird URL: %s; source URL: %s", databaseURL, sourceURL)
	m, err := migrate.New(sourceURL, databaseURL)
	if err != nil {
		log.Fatal(err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal(err)
	}
}
