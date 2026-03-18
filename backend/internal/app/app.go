package app

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	httpServer "github.com/stepan41k/billing-service/internal/app/http_server"
	"github.com/stepan41k/billing-service/internal/config"
	handerAuth "github.com/stepan41k/billing-service/internal/handler/auth"
	handerProfile "github.com/stepan41k/billing-service/internal/handler/profile"
	"github.com/stepan41k/billing-service/internal/repository/firebird"
	serviceAuth "github.com/stepan41k/billing-service/internal/service/auth"
	serviceProfile "github.com/stepan41k/billing-service/internal/service/profile"
	"go.uber.org/zap"
)

type Repository interface {
	Close() error
}

type App struct {
	log        *zap.Logger
	repo       Repository
	httpServer *httpServer.HttpServer
}

func New(cfg *config.Config, log *zap.Logger) (*App, error) {

	repository, err := firebird.NewDB(cfg.FireBird.DSN())
	if err != nil {
		return nil, err
	}

	// service
	sAuth := serviceAuth.New(log, repository)
	sProfile := serviceProfile.New(log, repository)

	// handler
	hAuth := handerAuth.New(log, sAuth)
	hProfile := handerProfile.New(log, sProfile)

	router := chi.NewRouter()
	router.Route("/", func(r chi.Router) {
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("ok"))
		})
		r.Post("/login", hAuth.Login(context.Background()))
		r.Post("/profile", hProfile.GetClient(context.Background()))
	})

	return &App{
		log:        log,
		repo:       repository,
		httpServer: httpServer.New(&cfg.ServerConfig, router),
	}, nil
}

func (a *App) Run() error {
	const op = "app.Run"
	log := a.log.With(
		zap.String("op", op),
		zap.String("addr", a.httpServer.Addr()),
	)

	log.Info("starting application")
	return a.httpServer.Run()
}

func (a *App) Stop(ctx context.Context) error {
	const op = "app.Stop"
	log := a.log.With(
		zap.String("op", op),
		zap.String("addr", a.httpServer.Addr()),
	)

	log.Info("stopping application")
	// HTTP server
	log.Info("stopping http server")
	if err := a.httpServer.Stop(ctx); err != nil {
		log.Error("http server stop failed", zap.Error(err))
		return fmt.Errorf("%s: httpServer.Stop: %w", op, err)
	}
	log.Debug("http server stopped")

	// Repository
	log.Info("closing repository")
	if err := a.repo.Close(); err != nil {
		log.Error("repository close failed", zap.Error(err))
		return fmt.Errorf("%s: repo.Close: %w", op, err)
	}
	log.Debug("repository closed")

	log.Info("application stopped successfully")
	return nil
}
