#!/bin/sh
docker=bipus
auth=auth
client=client
tickets=tickets

echo [Build the $auth latest]:
docker build -t $docker/$auth ./$auth

echo [Push the $auth latest]:
docker push $docker/$auth

echo [Build the $client latest]:
docker build -t $docker/$client ./$client

echo [Push the $client latest]:
docker push $docker/$client

echo [Build the $tickets latest]:
docker build -t $docker/$tickets ./$tickets

echo [Push the $tickets latest]:
docker push $docker/$tickets

echo [List all images]:
docker images --filter=reference="$docker/*"

