.PHONY: help setup dev docker-up docker-down seed seed-catalog seed-billing seed-bulk demo-reset billing-run test test-e2e lint format check

help:
	@echo "LoopOS - Subscription Management System"
	@echo "Available commands:"
	@echo "  make check        - Run lint, typecheck, check-routes, check-api, unit tests"
	@echo "  make setup        - Install deps, start docker, generate prisma client"
	@echo "  make dev          - Start Next.js development server"
	@echo "  make docker-up    - Start Postgres & Mailpit via Docker Compose"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make seed         - Seed catalog and billing data"
	@echo "  make seed-catalog - Seed products, variants, plans (Dev B)"
	@echo "  make seed-billing - Seed tax, discounts, invoices (Dev A)"
	@echo "  make seed-bulk    - Seed 10,000 subscriptions for query perf test"
	@echo "  make demo-reset   - Reset DB to clean demo state and sync clock"
	@echo "  make billing-run  - Trigger manual billing cycle batch run"
	@echo "  make test         - Run Vitest unit & module tests"
	@echo "  make test-e2e     - Run end-to-end integration tests"
	@echo "  make lint         - Run ESLint to verify module boundaries"
	@echo "  make format       - Run Prettier to format codebase"

setup:
	npm install
	docker compose up -d postgres mailpit
	npx prisma generate
	@echo "Setup complete! Run 'make dev' to start."

dev:
	npm run dev

docker-up:
	docker compose up -d

docker-down:
	docker compose down

seed:
	npm run db:seed

seed-catalog:
	npm run db:seed:catalog

seed-billing:
	npm run db:seed:billing

seed-bulk:
	npm run db:seed:bulk

demo-reset:
	npm run demo:reset

billing-run:
	npm run billing:run

test:
	npm run test

test-e2e:
	npm run test:e2e

lint:
	npm run lint

format:
	npm run format

check:
	npm run check
