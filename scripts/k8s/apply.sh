#!/bin/sh
auth=auth
client=client
tickets=tickets
orders=orders
expiration=expiration
ER=expiration-redis
payments=payments
nats=nats
jwt=jwt

# List of configurations or secrets
configList=""
secretList="$jwt $nats"

# Lists of deployment
eventsList="$ER $nats"
databaseList="$auth $tickets $orders $payments"
servicesList="$client $auth $tickets $orders $expiration $payments"

# Secrets
for secret in $secretList; do
  echo ["Apply secret $secret"]
  kubectl apply -f ./infra/k8s/secrets/$secret-secret.yaml
done
# Configs
for config in $configList; do
  echo ["Apply config $config"]
  kubectl apply -f ./infra/k8s/configs/$config-config.yaml
done
# Events
for event in $eventsList; do
  echo ["Apply event $event"]
  kubectl apply -f ./infra/k8s/$event-depl.yaml
done
# Services
for srv in $servicesList; do
  echo ["Apply service $srv"]
  kubectl apply -f ./infra/k8s/$srv-depl.yaml
done
# Database
for db in $databaseList; do
  echo ["Apply database $db-mongo"]
  kubectl apply -f ./infra/k8s/$db-mongo-depl.yaml
done

# Nginx
echo [Apply ingress-srv]
kubectl apply -f ./infra/k8s/ingress-srv.yaml

echo [-----------Info about cluster------------]
kubectl cluster-info
echo [-----------Check namespace---------------]
kubectl get namespace
echo [-----------Check all--------------------]
kubectl get all --all-namespaces
