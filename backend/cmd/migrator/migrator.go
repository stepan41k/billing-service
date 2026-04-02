package migrator

import (
	"database/sql"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/firebird"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/nakagami/firebirdsql"
	"github.com/stepan41k/billing-service/internal/config"
	// "github.com/stepan41k/billing-service/internal/config"
)

func Migrate() {
	cfgFireBird := config.MustLoadMigration()
	migrationPath := os.Getenv("MIGRATIONS_PATH")
	if migrationPath == "" {
		migrationPath = "/app/migrations"
	}
	sourceURL := "file://" + migrationPath

	log.Printf("INFO: FireBird DNS - %s; sourceURL - %s", cfgFireBird.DSN(), sourceURL)

	db, err := sql.Open("firebirdsql", cfgFireBird.DSN())
	if err != nil {
		log.Fatalf("ERROR: Не удалось открыть базу: %v", err)
	}
	defer db.Close()

	driver, err := firebird.WithInstance(db, &firebird.Config{})
	if err != nil {
		log.Fatalf("ERROR: Ошибка создания драйвера мигратора: %v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		sourceURL,
		"firebird",
		driver,
	)
	if err != nil {
		log.Fatalf("ERROR: Ошибка инициализации мигратора: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("ERROR: Ошибка при выполнении миграции: %v", err)
	}

	if err == migrate.ErrNoChange {
		log.Println("INFO: Миграции не требуются (база актуальна)")
	} else {
		log.Println("INFO: Миграции успешно применены!")
	}
}
