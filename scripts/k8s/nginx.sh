#!/bin/sh
echo [Ningix start]
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.7.0/deploy/static/provider/cloud/deploy.yaml

echo [Apply ingress-srv]
kubectl apply -f ./infra/k8s-dev/ingress-srv.yaml