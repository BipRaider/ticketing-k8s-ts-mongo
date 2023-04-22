#!/bin/sh

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

echo [Apply nats-srv]
kubectl apply -f ./infra/k8s/nast-depl.yaml

echo [Apply ingress-srv]
kubectl apply -f ./infra/k8s/ingress-srv.yaml


echo [-----------Check Pods--------------------]
kubectl get pods

echo [-----------Check Deployments-------------]
kubectl get deployments

echo [-----------Check Services----------------]
kubectl get services
echo [-----------------------------------------]

nginx=ingress-nginx
echo [-----------Check namespace---------------]
kubectl get namespace
echo [-----------Check Pods-$nginx-------------]
kubectl get pods -n $nginx

echo [------Check Deployments-$nginx-----------]
kubectl get deployments -n $nginx

echo [-------Check Services-$nginx-------------]
kubectl get services -n $nginx