#!/bin/sh
echo [Restart auth]
kubectl rollout restart deployment auth-depl

echo [Restart client]
kubectl rollout restart deployment client-depl
