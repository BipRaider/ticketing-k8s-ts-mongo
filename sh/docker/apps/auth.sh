#!/bin/sh
echo [Build the latest]:
docker build -t bipus/auth ./auth

echo [Push the latest]:
docker push bipus/auth

echo [Restart auth]
kubectl rollout restart deployment auth-depl