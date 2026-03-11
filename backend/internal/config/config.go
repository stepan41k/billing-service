package config

import (
	"log"
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type Config struct {
	Env          string       `yaml:"env"`
	serverConfig serverConfig `yaml:"http_server"`
	tokenConfig  tokenConfig
}

type serverConfig struct {
	addr        string        `yaml:"addr"`
	port        string        `yaml:"port"`
	timeout     time.Duration `yaml:"timeout"`
	idleTimeout time.Duration `yaml:"time.Duration"`
}

type tokenConfig struct {
	accessTokenTTL  time.Duration `yaml:"access_token_ttl"`
	refreshTokenTTL time.Duration `yaml:"refresh_token_ttl"`
	accessSecret    []byte        `yaml:"-"`
	refreshSecret   []byte        `yaml:"-"`
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

	cfg.tokenConfig.accessSecret = []byte(mustGetEnv("acessSecret"))
	cfg.tokenConfig.refreshSecret = []byte(mustGetEnv("refreshSecret"))

	return &cfg
}
func mustGetEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("requreid env varible %q is not set", key)
	}
	return v
}
