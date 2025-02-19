#!/bin/bash

# Start Keycloak in the background
docker compose up -d

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to be ready..."
until curl -s http://localhost:8080/realms/practice-management > /dev/null; do
  sleep 5
done
echo "Keycloak is ready!"

# Wait for the app to be ready
echo "Waiting for app to be ready..."
until curl -s http://localhost:5173 > /dev/null; do
  sleep 5
done
echo "App is ready!"

# Run the tests
npm run test:e2e

# Clean up
docker compose down
