#!/bin/bash
set -e

echo "=== System Validation ==="

echo "1. Checking backend health..."
curl -sf http://localhost:15782/api/v1/health || { echo "Backend not responding"; exit 1; }
echo " OK"

echo "2. Checking backend readiness..."
curl -sf http://localhost:15782/api/v1/ready || { echo "Backend not ready"; exit 1; }
echo " OK"

echo "3. Checking pastor portal..."
curl -sf http://localhost:15780 > /dev/null || { echo "Pastor portal not responding"; exit 1; }
echo " OK"

echo "4. Checking follower portal..."
curl -sf http://localhost:15781 > /dev/null || { echo "Follower portal not responding"; exit 1; }
echo " OK"

echo "5. Checking Keycloak..."
curl -sf http://localhost:15785/health/ready > /dev/null || { echo "Keycloak not ready"; exit 1; }
echo " OK"

echo "=== All validations passed ==="
