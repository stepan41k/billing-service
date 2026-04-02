package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type Config struct {
	Env          string       `yaml:"env"`
	ServerConfig ServerConfig `yaml:"http_server"`
	FireBird     FireBird     `yaml:"firebird"`
	TokenConfig  TokenConfig  `yaml:"token"`
}

type ServerConfig struct {
	Host        string        `yaml:"host"`
	Port        string        `yaml:"port"`
	Timeout     time.Duration `yaml:"timeout"`
	IdleTimeout time.Duration `yaml:"time.Duration"`
}

func (s *ServerConfig) Addr() string {
	return s.Host + ":" + s.Port
}

type FireBird struct {
	Host         string        `env:"FB_HOST" env-required:"true"`
	Port         int           `env:"FB_PORT" env-required:"true"`
	Name         string        `env:"FB_NAME" env-required:"true"`
	User         string        `env:"FB_USER" env-required:"true"`
	Password     string        `env:"FB_PASSWORD" env-required:"true"`
	MaxOpenConns int           `yaml:"max_open_conns" env-default:"10"`
	ConnTimeout  time.Duration `yaml:"conn_timeout" env-default:"5s"`
	Charset      string        `yaml:"charset" env-default:"UTF8"`
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

type TokenConfig struct {
	AccessTokenTTL  time.Duration `yaml:"access_token_ttl" env-default:"15m"`
	RefreshTokenTTL time.Duration `yaml:"refresh_token_ttl" env-default:"43200m"`
	AccessSecret    []byte        `yaml:"-"`
	RefreshSecret   []byte        `yaml:"-"`
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
	if err := godotenv.Load(); err != nil {
		log.Println("INFO: .env not loaded")
	}

	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		log.Fatalf("CONFIG_PATH is not set")
	}

	if _, err := os.Stat(configPath); err != nil {
		log.Fatalf("config file not found at %s: %v", configPath, err)
	}

	var cfg Config

	if err := cleanenv.ReadConfig(configPath, &cfg); err != nil {
		log.Fatalf("failed to load config from %s: %v", configPath, err)
	}

	cfg.TokenConfig.AccessSecret = []byte(mustGetEnv("ACCESS_SECRET"))
	cfg.TokenConfig.RefreshSecret = []byte(mustGetEnv("REFRESH_SECRET"))

	return &cfg
}

func mustGetEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("FATAL: environment variable %s is required but not set", key)
	}
	return v
}
