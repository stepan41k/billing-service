package domain

import "context"

type AuthInfo struct {
	ID    int64
	Login string
}

type authKey struct{}

func ContextWithAuth(ctx context.Context, info AuthInfo) context.Context {
	return context.WithValue(ctx, authKey{}, info)
}

func AuthFromContext(ctx context.Context) (AuthInfo, bool) {
	info, ok := ctx.Value(authKey{}).(AuthInfo)
	return info, ok
}
