#!/bin/sh
del=delete
echo [$del auth deployment]
kubectl $del deployment auth-depl

echo [$del client deployment]
kubectl $del deployment client-depl

echo [$del tickets deployment]
kubectl $del deployment tickets-depl

echo [$del auth service]
kubectl $del service auth-srv

echo [$del tickets service]
kubectl $del service tickets-srv

echo [$del client service]
kubectl $del service client-srv

nginx=ingress-nginx
echo [--------Ningix---------]
echo [$del client deployment]
kubectl $del deployment -n $nginx $nginx-controller
echo [$del client service]
kubectl $del service -n $nginx $nginx-controller-admission
echo [$del client pod]
kubectl $del pod -n $nginx $nginx-admission-create-4lf5t
kubectl $del pod -n $nginx $nginx-admission-patch-ddhzt
kubectl $del pod -n $nginx $nginx-controller-7d9674b7cf-2tndh