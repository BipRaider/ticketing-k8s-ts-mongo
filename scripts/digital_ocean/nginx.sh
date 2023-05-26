#!/bin/sh
# https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean
echo [Switch to the cluster into digital ocean]
kubectl config use-context tickiting

echo [Ningix start into Digita Ocean]
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.7.1/deploy/static/provider/do/deploy.yaml

echo [Apply ingress-srv]
kubectl apply -f ./infra/k8s-prod/ingress-srv.yaml