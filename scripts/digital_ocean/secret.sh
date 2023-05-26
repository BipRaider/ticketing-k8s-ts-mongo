#!/bin/sh
JWT_SALT=JWT_SALT
JWT_SALT_SECRET=jwtSecretSoltApp

echo [Switch to the cluster into digital ocean]
kubectl config use-context tickiting

echo [Delete old secret]
kubectl delete secret jwt-secret
kubectl delete secret stripe-secret
kubectl delete secret stripe-pub-secret

echo [create secret jwt-secret]
kubectl create secret generic jwt-secret --from-literal=$JWT_SALT=$JWT_SALT_SECRET

echo [create secret stripe-secret]
kubectl create secret generic stripe-secret  --from-literal=STRIPE_KEY=your_key

echo [create secret stripe-pub-secret]
kubectl create secret generic stripe-pub-secret  --from-literal=STRIPE_PUB_KEY=your_key

echo [get secrets]
kubectl get secrets