#!/bin/sh
auth=auth
client=client
tickets=tickets
orders=orders
expiration=expiration
payments=payments
ER=expiration-redis
nats=nats

# Lists of deployment
eventsList="$ER $nats"
databaseList="$auth $tickets $orders $payments"
servicesList="$client $auth $tickets $orders $expiration $payments"

# Events
for event in $eventsList; do
  echo ["Need to restart event: $event? [y\n]"]
  read build
  if [ "${build}" == "y" ]; then
    kubectl rollout restart deployment $event-depl
  fi
done
# Services
for srv in $servicesList; do
  echo ["Need to restart service: $srv? [y\n]"]
  read build
  if [ "${build}" == "y" ]; then
    kubectl rollout restart deployment $srv-depl
  fi
done
# Database
for db in $databaseList; do
  echo ["Need to restart database: $db?  [y\n]"]
  read build
  if [ "${build}" == "y" ]; then
    kubectl rollout restart deployment $db-mongo-depl
  fi
done

echo [Delete all duplicates]
npm run d:clear

kubectl get all