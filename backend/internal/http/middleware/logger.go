package middleware

import (
	"net/http"
	"time"

	"go.uber.org/zap"
)

type warpWriteHeader struct {
	http.ResponseWriter
	status int
}

func (r *warpWriteHeader) WriteHeader(status int) {
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}

func LoggerMiddleware(log *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			ww := &warpWriteHeader{
				ResponseWriter: w,
				status:         r.ProtoMajor,
			}

			next.ServeHTTP(ww, r)
			log.Info("http request",
				zap.String("method", r.Method),
				zap.String("path", r.URL.Path),
				zap.String("remote_addr", r.RemoteAddr),
				zap.Int("status", ww.status),
				zap.Duration("duration", time.Since(start)),
			)
		})
	}
}
