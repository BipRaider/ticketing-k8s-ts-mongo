#!/bin/sh
echo [clear none images]:
docker image prune

echo [clear none container]:
docker container prune

echo [clear replicaset]:
npm run k:delete:repl

echo [List all images]:
docker images --filter=reference='bipus/*'
