#!/bin/sh
echo [-----------Check Pods-ingress-nginx------]
kubectl get pods -n ingress-nginx

echo [------Check Deployments-ingress-nginx----]
kubectl get deployments -n ingress-nginx

echo [-------Check Services-ingress-nginx------]
kubectl get services -n ingress-nginx

echo [-----------Check describe --nginx--------]
kubectl describe service -n ingress-nginx

echo [-----------------------------------------]
echo [-----------Check Application-------------]
echo [-----------------------------------------]

echo [-----------Check Pods--------------------]
kubectl get pods

echo [-----------Check Deployments-------------]
kubectl get deployments

echo [-----------Check Services----------------]
kubectl get services
echo [-----------------------------------------]

echo [-----------Check auth--------------------]
kubectl describe service auth
kubectl describe deployment auth-depl
echo [-----------------------------------------]

echo [-----------Check auth-mongo--------------]
kubectl describe service auth-mongo
kubectl describe deployment auth-mongo-depl
echo [-----------------------------------------]

echo [------------Check client-----------------]
kubectl describe service client
kubectl describe deployment client-depl
echo [-----------------------------------------]

echo [---Show running and stopped containers---]
docker ps -a