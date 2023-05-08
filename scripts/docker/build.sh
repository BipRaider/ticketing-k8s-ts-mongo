#!/bin/sh
docker=bipus
auth=auth
client=client
tickets=tickets
orders=orders


echo ["Need to build Auth server? [y\n]"]
read authBuild
if [ "${authBuild}" == "y" ]; then
  echo [Build the $auth latest]:
  docker build -t $docker/$auth ./$auth
  echo [Push the $auth latest]:
  docker push $docker/$auth
fi

echo ["Need to build Client web? [y\n]"]
read clientBuild
if [ "${clientBuild}" == "y" ]; then
  echo [Build the $client latest]:
  docker build -t $docker/$client ./$client

  echo [Push the $client latest]:
  docker push $docker/$client
fi

echo ["Need to build Ticket server? [y\n]"]
read ticketBuild
if [ "${ticketBuild}" == "y" ]; then
  echo [Build the $tickets latest]:
  docker build -t $docker/$tickets ./$tickets

  echo [Push the $tickets latest]:
  docker push $docker/$tickets
fi

echo ["Need to build Order server? [y\n]"]
read orderBuild
if [ "${orderBuild}" == "y" ]; then
  echo [Build the $orders latest]:
  docker build -t $docker/$orders ./$orders

  echo [Push the $orders latest]:
  docker push $docker/$orders
fi

echo [List all images]:
docker images --filter=reference="$docker/*"

