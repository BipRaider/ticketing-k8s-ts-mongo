#!/bin/sh
echo [Delete auth deployment]
kubectl delete deployment auth-depl

echo [Delete client deployment]
kubectl delete deployment client-depl

echo [Delete auth service]
kubectl delete service auth-srv

echo [Delete client service]
kubectl delete service client-srv


echo [--------Ningix---------]
echo [Delete client deployment]
kubectl delete deployment -n ingress-nginx ingress-nginx-controller
echo [Delete client service]
kubectl delete service -n ingress-nginx ingress-nginx-controller-admission
echo [Delete client pod]
kubectl delete pod -n ingress-nginx ingress-nginx-admission-create-4lf5t
kubectl delete pod -n ingress-nginx ingress-nginx-admission-patch-ddhzt
kubectl delete pod -n ingress-nginx ingress-nginx-controller-7d9674b7cf-2tndh