package migrator

import (
	"database/sql"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/firebird"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/nakagami/firebirdsql"
	// "github.com/stepan41k/billing-service/internal/config"
)

func Migrate() {
	// cfgFireBird := config.MustLoadMigration()
	migrationPath := os.Getenv("MIGRATIONS_PATH")
	if migrationPath == "" {
		migrationPath = "/app/migrations"
	}

	sourceURL := "file://" + migrationPath
	// databaseURL := "firebirdsql://" + cfgFireBird.DSN()

	dsn := "BILLING:masterkey@192.168.1.22:3050/C:/DATABASES/BILLING.FDB?auth_plugin_name=Srp"

	db, err := sql.Open("firebirdsql", dsn)
	if err != nil {
		log.Fatalf("CRITICAL: Не удалось открыть базу: %v", err)
	}
	defer db.Close()

	driver, err := firebird.WithInstance(db, &firebird.Config{})
	if err != nil {
		log.Fatalf("CRITICAL: Ошибка создания драйвера мигратора: %v", err)
	}

	log.Printf("INFO: Запуск миграций. Источник: %s", sourceURL)

	m, err := migrate.NewWithDatabaseInstance(
		sourceURL,
		"firebird",
		driver,
	)
	if err != nil {
		log.Fatalf("CRITICAL: Ошибка инициализации мигратора: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("CRITICAL: Ошибка при выполнении миграции: %v", err)
	}

	if err == migrate.ErrNoChange {
		log.Println("INFO: Миграции не требуются (база актуальна)")
	} else {
		log.Println("SUCCESS: Миграции успешно применены!")
	}
}
