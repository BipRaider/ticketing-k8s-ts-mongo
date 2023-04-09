#!/bin/sh
echo [clear none images]:
docker image prune

echo [clear none container]:
docker container prune

echo [List all images]:
docker images --filter=reference='bipus/*'

