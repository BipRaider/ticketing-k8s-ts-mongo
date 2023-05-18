#!/bin/sh
auth=auth
client=client
tickets=tickets
orders=orders
expiration=expiration
nats=nats

# Services
echo [Restart $auth]
kubectl rollout restart deployment $auth-depl

echo [Restart $tickets]
kubectl rollout restart deployment $tickets-depl

echo [Restart $orders]
kubectl rollout restart deployment $orders-depl

echo [Restart $expiration]
kubectl rollout restart deployment $expiration-depl

# DB
echo [Restart $auth-mongo]
kubectl rollout restart deployment $auth-mongo-depl

echo [Restart $tickets-mongo]
kubectl rollout restart deployment $tickets-mongo-depl

echo [Restart $orders-mongo]
kubectl rollout restart deployment $orders-mongo-depl

# WEB
echo [Restart $client]
kubectl rollout restart deployment $client-depl

# other services
echo [Restart $nats]
kubectl rollout restart deployment $nats-depl

echo [Delete all duplicates]
npm run d:clear