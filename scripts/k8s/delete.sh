#!/bin/sh
del=delete
echo [--------Deployment---------]
echo [$del auth deployment]
kubectl $del deployment auth-depl

echo [$del client deployment]
kubectl $del deployment client-depl

echo [$del tickets deployment]
kubectl $del deployment tickets-depl

echo [$del nats deployment]
kubectl $del deployment nats-depl

echo [$del auth service]
kubectl $del deployment auth-mongo-depl

echo [$del tickets service]
kubectl $del deployment tickets-mongo-depl

echo [--------Service---------]
echo [$del auth service]
kubectl $del service auth-srv

echo [$del tickets service]
kubectl $del service tickets-srv

echo [$del auth service]
kubectl $del service auth-mongo-srv

echo [$del tickets service]
kubectl $del service tickets-mongo-srv

echo [$del nats service]
kubectl $del service nats-srv
kubectl $del service nats-srv-02
kubectl $del service nats-headless

echo [$del client service]
kubectl $del service client-srv

echo [--------hpa---------]
echo [$del auth service]
kubectl $del hpa auth-hpa

echo [$del tickets service]
kubectl $del hpa tickets-hpa

echo [$del nats service]
kubectl $del hpa nats-hpa

echo [$del client service]
kubectl $del hpa client-hpa

echo [$del auth service]
kubectl $del hpa auth-mongo-hpa

echo [$del tickets service]
kubectl $del hpa tickets-mongo-hpa

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