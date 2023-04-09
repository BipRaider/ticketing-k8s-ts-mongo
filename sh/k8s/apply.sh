#!/bin/sh
echo [Restart auth]
kubectl apply -f ./infra/k8s/auth-depl.yaml

echo [Restart client]
kubectl apply -f ./infra/k8s/client-depl.yaml

echo [Restart ingress-srv]
kubectl apply -f ./infra/k8s/ingress-srv.yaml