package config

import (
	"fmt"
	"log"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type Config struct {
	Env          string `env:"ENV"`
	ServerConfig ServerConfig
	FireBird     FireBird
	TokenConfig  TokenConfig
}

type ServerConfig struct {
	Host        string        `env:"HOST"`
	Port        string        `env:"PORT"`
	Timeout     time.Duration `env:"TIMEOUT"`
	IdleTimeout time.Duration `env:"IDLE_TIMEOUT"`
}

type FireBird struct {
	Host         string        `env:"FB_HOST" env-required:"true"`
	Port         int           `env:"FB_PORT" env-required:"true"`
	Name         string        `env:"FB_NAME" env-required:"true"`
	User         string        `env:"FB_USER" env-required:"true"`
	Password     string        `env:"FB_PASSWORD" env-required:"true"`
	MaxOpenConns int           `env:"MAX_OPEN_CONNS" env-default:"10"`
	ConnTimeout  time.Duration `env:"CONN_TIMEOUT" env-default:"5s"`
	Charset      string        `env:"CHARSET" env-default:"UTF8"`
}

type TokenConfig struct {
	AccessTokenTTL  time.Duration `env:"ACCESS_TOKEN_TTL" env-default:"15m"`
	RefreshTokenTTL time.Duration `env:"REFRESH_TOKEN_TTL" env-default:"43200m"`
	AccessSecret    []byte        `env:"ACCESS_SECRET"`
	RefreshSecret   []byte        `env:"REFRESH_SECRET"`
}

func (s *ServerConfig) Addr() string {
	return s.Host + ":" + s.Port
}

func (f *FireBird) DSN() string {
	return fmt.Sprintf("%s:%s@%s:%d/%s",
		f.User,
		f.Password,
		f.Host,
		f.Port,
		f.Name,
	)
}

func MustLoadMigration() *FireBird {
	if err := godotenv.Load(); err != nil {
		log.Println("INFO: .env not loaded")
	}

	var fb FireBird
	if err := cleanenv.ReadEnv(&fb); err != nil {
		log.Fatalf("failed to load migration env: %v", err)
	}
	return &fb
}

func MustLoad() *Config {
	var cfg Config

	if err := cleanenv.ReadEnv(&cfg); err != nil {
		log.Fatalf("cannot read config: %s", err)
	}

	return &cfg
}
