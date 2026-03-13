.PHONY: dev dev-down test-all lint-all format-all clean

# Development
dev:
	docker compose up --build

dev-down:
	docker compose down

dev-backend:
	cd backend && uvicorn app.main:app --host 0.0.0.0 --port 15782 --reload

dev-pastor:
	cd frontend && npm run dev:pastor

dev-follower:
	cd frontend && npm run dev:follower

# Testing
test-backend-unit:
	cd backend && python -m pytest tests/unit -v

test-backend-integration:
	cd backend && python -m pytest tests/integration -v

test-backend-all:
	cd backend && python -m pytest tests/ -v --cov=app --cov-report=term-missing

test-frontend-unit:
	cd frontend && npm run test:unit

test-frontend-e2e:
	cd frontend && npm run test:e2e

test-all: test-backend-all test-frontend-unit

# Linting & Formatting
lint-backend:
	cd backend && ruff check app/ && mypy app/

lint-frontend:
	cd frontend && npm run lint && npm run typecheck

lint-all: lint-backend lint-frontend

format-backend:
	cd backend && ruff format app/

format-all: format-backend

# Cleanup
clean:
	docker compose down -v
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name dist -exec rm -rf {} + 2>/dev/null || true
