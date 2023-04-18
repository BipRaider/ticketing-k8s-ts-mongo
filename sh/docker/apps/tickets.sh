#!/bin/sh
docker=bipus
app=tickets

echo [Build the latest]:
docker build -t $docker/$app ./$app

echo [Push the latest]:
docker push $docker/$app

echo [Restart $app]
kubectl rollout restart deployment $app-depl