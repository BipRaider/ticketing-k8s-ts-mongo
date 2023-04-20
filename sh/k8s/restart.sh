#!/bin/sh
echo [Restart auth]
kubectl rollout restart deployment auth-depl

echo [Restart tickets]
kubectl rollout restart deployment tickets-depl

echo [Restart client]
kubectl rollout restart deployment client-depl
