#!/bin/sh
nginx=ingress-nginx
echo [-----------Check namespace---------------]
kubectl get namespace
echo [-----------Check Pods-$nginx-------------]
kubectl get pods -n $nginx

echo [------Check Deployments-$nginx-----------]
kubectl get deployments -n $nginx

echo [-------Check Services-$nginx-------------]
kubectl get services -n $nginx

echo [------Check describe-$nginxginx----------]
kubectl describe service -n $nginx

echo [-----------------------------------------]
echo [-----------Check Application-------------]
echo [-----------------------------------------]

echo [-----------Check Pods--------------------]
kubectl get pods

echo [-----------Check Deployments-------------]
kubectl get deployments

echo [-----------Check Services----------------]
kubectl get services
echo [-----------------------------------------]

auth=auth
echo [-----------Check $auth-------------------]
kubectl describe service $auth
kubectl describe deployment $auth-depl
echo [-----------------------------------------]

echo [-----------Check $auth-mongo-------------]
kubectl describe service $auth-mongo
kubectl describe deployment $auth-mongo-depl
echo [-----------------------------------------]

tickets=tickets
echo [-----------Check $tickets----------------]
kubectl describe service $tickets
kubectl describe deployment $tickets-depl
echo [-----------------------------------------]

echo [-----------Check $tickets-mongo----------]
kubectl describe service $tickets-mongo
kubectl describe deployment $tickets-mongo-depl
echo [-----------------------------------------]

client=client
echo [------------Check $client----------------]
kubectl describe service $client
kubectl describe deployment $client-depl
echo [-----------------------------------------]

echo [---Show running and stopped containers---]
docker ps -a

echo [Show secrets]
kubectl get secrets