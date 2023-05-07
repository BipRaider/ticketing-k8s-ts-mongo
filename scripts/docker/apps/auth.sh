#!/bin/sh
docker=bipus
app=auth

echo [Build the latest]:
docker build -t bipus/$app ./$app

echo [Push the latest]:
docker push bipus/$app

echo [Restart $app]
kubectl rollout restart deployment $app-depl