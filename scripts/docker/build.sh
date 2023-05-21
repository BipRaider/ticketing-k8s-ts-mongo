#!/bin/sh
docker=bipus

# Apps servieses
auth=auth
client=client
tickets=tickets
orders=orders
expiration=expiration
payments=payments

servicesList="$client $auth $tickets $orders $expiration $payments"

for server in $servicesList; do
  echo ["Need to build $server server? [y\n]"]
  read build
  if [ "${build}" == "y" ]; then
    echo [Build the $server latest]:
    docker build -t $docker/$server ./$server
    echo [Push the $server latest]:
    docker push $docker/$server
  fi
done

echo [List all images]:
docker images --filter=reference="$docker/*"

