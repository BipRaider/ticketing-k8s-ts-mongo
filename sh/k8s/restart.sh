#!/bin/sh
echo [Restart auth]
kubectl rollout restart deployment auth-depl

echo [Restart tickets]
kubectl rollout restart deployment tickets-depl

echo [Restart auth-mongo]
kubectl rollout restart deployment auth-mongo-depl

echo [Restart tickets-mongo]
kubectl rollout restart deployment tickets-mongo-depl

echo [Restart client]
kubectl rollout restart deployment client-depl

echo [Restart nats]
kubectl rollout restart deployment nats-depl