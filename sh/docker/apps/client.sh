#!/bin/sh
echo [Build the latest]:
docker build -t bipus/client ./client

echo [Push the latest]:
docker push bipus/client

echo [Restart client]
kubectl rollout restart deployment client-depl