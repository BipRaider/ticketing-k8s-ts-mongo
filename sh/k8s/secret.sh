#!/bin/sh
echo [Delete old secret]
kubectl delete secret jwt-secret

echo [create secret]
kubectl create secret generic jwt-secret --from-literal=JWT_SALT=jwtSecretSoltApp

echo [get secrets]
kubectl get secrets