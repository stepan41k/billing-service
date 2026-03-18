package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/stepan41k/billing-service/internal/app"
	"github.com/stepan41k/billing-service/internal/config"
	"github.com/stepan41k/billing-service/internal/lib/logger"
	"go.uber.org/zap"
)

func main() {
	cfg := config.MustLoad()

	logger, err := logger.New(logger.Env(cfg.Env))
	if err != nil {
		log.Fatalf("failed initilizate logger: %s", err.Error())
	}

	application, err := app.New(cfg, logger)
	if err != nil {
		logger.Fatal("failed to initialize application", zap.Error(err))
	}

	go func() {
		application.Run()
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	signal := <-stop
	logger.Debug("os signal", zap.String("signal", signal.String()))

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	application.Stop(ctx)
}
