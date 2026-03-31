package migrator

import (
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/firebird" // Драйвер БД
	_ "github.com/golang-migrate/migrate/v4/source/file"       // ЭТОГО ИМПОРТА НЕ ХВАТАЛО
	_ "github.com/nakagami/firebirdsql"
	"github.com/stepan41k/billing-service/internal/config"
)

func Migrate() {
	cfgFireBird := config.MustLoadMigration()
	migrationPath := "./migration"
	log.Printf("INFO: FireBird DSN: %s; migration path: %s", cfgFireBird.DSN(), migrationPath)

	m, err := migrate.New("file:///app/migrations", "firebirdsql://"+cfgFireBird.DSN())
	if err != nil {
		log.Fatal(err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal(err)
	}
}
