#!/bin/sh
echo [Apply Secret Nats]
kubectl apply -f ./infra/k8s/secrets/nats-secret.yaml

echo [Apply Secret JWT]
kubectl apply -f ./infra/k8s/secrets/jwt-secret.yaml

echo [Apply auth]
kubectl apply -f ./infra/k8s/auth-depl.yaml

echo [Apply auth-mongo]
kubectl apply -f ./infra/k8s/auth-mongo-depl.yaml

echo [Apply client]
kubectl apply -f ./infra/k8s/client-depl.yaml

echo [Apply tickets]
kubectl apply -f ./infra/k8s/tickets-depl.yaml

echo [Apply tickets-mongo]
kubectl apply -f ./infra/k8s/tickets-mongo-depl.yaml

# echo [Apply nats-config]
# kubectl apply -f ./infra/k8s/configs/nats-config.yaml

# echo [Apply nats-auth-config]
# kubectl apply -f ./infra/k8s/configs/nats-auth-config.yaml

echo [Apply nats-srv]
kubectl apply -f ./infra/k8s/nats-depl.yaml


echo [Apply ingress-srv]
kubectl apply -f ./infra/k8s/ingress-srv.yaml

echo [-----------Info about cluster------------]
kubectl cluster-info
echo [-----------Check namespace---------------]
kubectl get namespace
echo [-----------Check all--------------------]
kubectl get all --all-namespaces
