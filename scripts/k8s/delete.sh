#!/bin/sh
del=delete
auth=auth
client=client
tickets=tickets
orders=orders
expiration=expiration
ER=expiration-redis
payments=payments
nats=nats

# List of configurations or secrets
configList=""
secretList="$jwt $nats"

# Lists of deployment
eventsList="$ER $nats"
databaseList="$auth $tickets $orders $payments"
servicesList="$client $auth $tickets $orders $expiration $payments"

# Secrets
for secret in $secretList; do
  echo ["Delete secret $secret"]
  kubectl delete secret $secret-secret
done
# Configs
for config in $configList; do
  echo ["Delete config $config"]
  kubectl delete config $config-secret
done
# Events
for event in $eventsList; do
  echo ["Delete the $event"]
  kubectl $del deployment $event-depl
  kubectl $del service $event-srv
  kubectl $del hpa $event-hpa
done
# Services
for srv in $servicesList; do
  echo ["Delete the $srv"]
  kubectl $del deployment $srv-depl
  kubectl $del service $srv-srv
  kubectl $del hpa $srv-hpa
done
# Database
for db in $databaseList; do
  echo ["Delete the $db-mongo"]
  kubectl $del deployment $db-mongo-depl
  kubectl $del service $db-mongo-srv
  kubectl $del hpa $db-hpa
done

echo [--------Namesoace---------]
kubectl delete namespace
echo [--------Ningix---------]
nginx=ingress-nginx
echo [$del client deployment]
kubectl $del deployment -n $nginx $nginx-controller
echo [$del client service]
kubectl $del service -n $nginx $nginx-controller-admission
echo [$del client pod]
kubectl $del pod -n $nginx $nginx-admission-create-p6xjg
kubectl $del pod -n $nginx $nginx-admission-patch-867ll
kubectl $del pod -n $nginx $nginx-controller-7d9674b7cf-9hbmw