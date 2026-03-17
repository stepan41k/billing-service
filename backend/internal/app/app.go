package app

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/stepan41k/billing-service/internal/app/httpServer"
	"github.com/stepan41k/billing-service/internal/config"
	"go.uber.org/zap"
)

type App struct {
	log        *zap.Logger
	httpServer *httpServer.HttpServer
}

func New(cfg *config.Config, log *zap.Logger) (*App, error) {

	// db :=
	// hander :=

	router := chi.NewRouter()
	router.Route("/", func(r chi.Router) {
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("ok"))
		})
		// r.Post("/login")
		// r.Post("/profile")
	})

	return &App{
		log:        log,
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
	return a.httpServer.Stop(ctx)
}
