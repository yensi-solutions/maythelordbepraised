#!/bin/bash
set -e

echo "=== MayTheLordBePraised — Setup ==="

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "=== Setup complete ==="
echo "Run 'make dev' to start all services"
