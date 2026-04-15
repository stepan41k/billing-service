.PHONY: migrate-create run stop lint

run:
	cd ../deploy && docker-compose up --build
	
stop:
	cd ../deploy && docker-compose down -v

lint:
	golangci-lint run ./...
	
migrate-create:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir migrations -format "20060102150405" -seq=false $$name