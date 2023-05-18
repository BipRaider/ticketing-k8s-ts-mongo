#!/bin/sh
del=delete
auth=auth
client=client
tickets=tickets
orders=orders
expiration=expiration
ER=expiration-redis
nats=nats


echo [--------Deployment---------]
echo [$del $auth deployment]
kubectl $del deployment $auth-depl

echo [$del $client deployment]
kubectl $del deployment $client-depl

echo [$del $tickets deployment]
kubectl $del deployment $tickets-depl

echo [$del $orders deployment]
kubectl $del deployment $orders-depl

echo [$del $expiration deployment]
kubectl $del deployment $expiration-depl

echo [$del $ER deployment]
kubectl $del deployment $ER-depl

echo [$del $nats deployment]
kubectl $del deployment $nats-depl

echo [$del $auth service]
kubectl $del deployment $auth-mongo-depl

echo [$del $tickets service]
kubectl $del deployment $tickets-mongo-depl

echo [$del $orders service]
kubectl $del deployment $orders-mongo-depl

echo [--------Service---------]
echo [$del $auth service]
kubectl $del service $auth-srv

echo [$del $tickets service]
kubectl $del service $tickets-srv

echo [$del $ER service]
kubectl $del service $ER-srv

echo [$del $orders service]
kubectl $del service $orders-srv

echo [$del $auth service]
kubectl $del service $auth-mongo-srv

echo [$del $tickets service]
kubectl $del service $tickets-mongo-srv

echo [$del $orders service]
kubectl $del service $orders-mongo-srv

echo [$del $nats service]
kubectl $del service $nats-srv
kubectl $del service $nats-srv-02
kubectl $del service $nats-headless

echo [$del $client service]
kubectl $del service $client-srv

echo [--------hpa---------]
echo [$del $auth hpa]
kubectl $del hpa $auth-hpa

echo [$del $tickets hpa]
kubectl $del hpa $tickets-hpa

echo [$del $orders hpa]
kubectl $del hpa $orders-hpa

echo [$del $expiration hpa]
kubectl $del hpa $expiration-hpa

echo [$del $ER hpa]
kubectl $del hpa $ER-hpa

echo [$del $nats hpa]
kubectl $del hpa $nats-hpa

echo [$del $client hpa]
kubectl $del hpa $client-hpa

echo [$del $auth hpa]
kubectl $del hpa $auth-mongo-hpa

echo [$del $tickets hpa]
kubectl $del hpa $tickets-mongo-hpa

echo [$del $orders hpa]
kubectl $del hpa $orders-mongo-hpa

echo [--------Namesoace---------]
# kubectl delete namespace
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