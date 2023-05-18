#!/bin/sh
auth=auth
client=client
tickets=tickets
orders=orders
expiration=expiration
ER=expiration-redis
nats=nats
jwt=jwt

# Configs
# echo [Apply $nats-config]
# kubectl apply -f ./infra/k8s/configs/$nats-config.yaml

# echo [Apply $nats-auth-config]
# kubectl apply -f ./infra/k8s/configs/$nats-auth-config.yaml

# Secrets
echo [Apply Secret JWT]
kubectl apply -f ./infra/k8s/secrets/$jwt-secret.yaml

echo [Apply Secret Nats]
kubectl apply -f ./infra/k8s/secrets/$nats-secret.yaml

# Events listeners
echo [Apply $nats]
kubectl apply -f ./infra/k8s/$nats-depl.yaml

echo [Apply $ER-srv]
kubectl apply -f ./infra/k8s/$ER-depl.yaml

# Apps services
echo [Apply $auth]
kubectl apply -f ./infra/k8s/$auth-depl.yaml

echo [Apply $tickets]
kubectl apply -f ./infra/k8s/$tickets-depl.yaml

echo [Apply $orders]
kubectl apply -f ./infra/k8s/$orders-depl.yaml

echo [Apply $expiration-srv]
kubectl apply -f ./infra/k8s/$expiration-depl.yaml

# Web
echo [Apply $client]
kubectl apply -f ./infra/k8s/$client-depl.yaml

# Database
echo [Apply $auth-mongo]
kubectl apply -f ./infra/k8s/$auth-mongo-depl.yaml

echo [Apply $tickets-mongo]
kubectl apply -f ./infra/k8s/$tickets-mongo-depl.yaml

echo [Apply $orders-mongo]
kubectl apply -f ./infra/k8s/$orders-mongo-depl.yaml

# nginx
echo [Apply ingress-srv]
kubectl apply -f ./infra/k8s/ingress-srv.yaml

echo [-----------Info about cluster------------]
kubectl cluster-info
echo [-----------Check namespace---------------]
kubectl get namespace
echo [-----------Check all--------------------]
kubectl get all --all-namespaces
