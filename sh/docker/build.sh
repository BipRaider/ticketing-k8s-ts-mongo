#!/bin/sh
echo [Build the latest]:
docker build -t bipus/auth ./auth

echo [Push the latest]:
docker push bipus/auth

echo [Build the latest]:
docker build -t bipus/client ./client

echo [Push the latest]:
docker push bipus/client


echo [List all images]:
docker images --filter=reference='bipus/*'

