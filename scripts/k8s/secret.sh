#!/bin/sh
JWT_SALT=JWT_SALT
JWT_SALT_SECRET=jwtSecretSoltApp

echo [Delete old secret]
kubectl delete secret jwt-secret

echo [create secret]
kubectl create secret generic jwt-secret --from-literal=$JWT_SALT=$JWT_SALT_SECRET

echo [get secrets]
kubectl get secrets

# kubectl create secret generic stripe-secret  --from-literal=STRIPE_KEY=
# kubectl create secret generic stripe-pub-secret  --from-literal=STRIPE_PUB_KEY=