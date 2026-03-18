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

type FireBird struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Name     string `yaml:"name"`
	User     string `yaml:"user"`
	Password string `env:"DB_PASSWORD"`
}

type ServerConfig struct {
	Host        string        `yaml:"host"`
	Port        string        `yaml:"port"`
	Timeout     time.Duration `yaml:"timeout"`
	IdleTimeout time.Duration `yaml:"time.Duration"`
}

type TokenConfig struct {
	AccessTokenTTL  time.Duration `yaml:"access_token_ttl"`
	RefreshTokenTTL time.Duration `yaml:"refresh_token_ttl"`
	AccessSecret    []byte        `yaml:"-"`
	RefreshSecret   []byte        `yaml:"-"`
}

func (f *FireBird) DSN() string {
	return fmt.Sprintf("%s:%s@%s:%d%s",
		f.User,
		f.Password,
		f.Host,
		f.Port,
		f.Name,
	)
}

func MustLoad() *Config {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("fatal load env file: %s", err.Error())
	}

	configPath := os.Getenv("CONFIG_FILE")
	if configPath == "" {
		log.Fatalf("config path is not set")
	}

	if _, err := os.Stat(configPath); err != nil {
		log.Fatalf("cannot read config: %s", err.Error())
	}

	var cfg Config

	if err := cleanenv.ReadConfig(configPath, &cfg); err != nil {
		log.Fatalf("cannot read config file: %s", err.Error())
	}

	cfg.TokenConfig.AccessSecret = []byte(mustGetEnv("ACCESS_SECRET"))
	cfg.TokenConfig.RefreshSecret = []byte(mustGetEnv("REFRESH_SECRET"))

	return &cfg
}

func (s *ServerConfig) Addr() string {
	return s.Host + ":" + s.Port
}

func mustGetEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("requreid env varible %q is not set", key)
	}
	return v
}
