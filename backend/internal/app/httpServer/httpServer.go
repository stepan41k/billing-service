package httpServer

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/stepan41k/billing-service/internal/config"
)

type HttpServer struct {
	httpServer *http.Server
}

func New(cfg *config.ServerConfig, handler http.Handler) *HttpServer {
	return &HttpServer{
		httpServer: &http.Server{
			Addr:        cfg.Addr(),
			Handler:     handler,
			ReadTimeout: cfg.Timeout,
			IdleTimeout: cfg.IdleTimeout,
		},
	}
}

func (hs *HttpServer) Addr() string {
	return hs.httpServer.Addr
}

func (hs *HttpServer) Run() error {
	const op = "app.httpServer.Run"
	if err := hs.httpServer.ListenAndServe(); err != nil {
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return fmt.Errorf("%s: %w", op, err)
	}
	return nil
}

func (hs *HttpServer) Stop(ctx context.Context) error {
	const op = "app.httpServer.Run"
	if err := hs.httpServer.Shutdown(ctx); err != nil {
		return fmt.Errorf("%s: %w", op, err)
	}
	return nil
}
