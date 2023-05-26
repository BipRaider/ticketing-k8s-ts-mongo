#!/bin/sh
echo [-----------config view -----------]
kubectl config view
echo [-----------Info about cluster-----------]
kubectl cluster-info
echo [-----------Check namespace--------------]
kubectl get namespace
echo [-----------Check all--------------------]
kubectl get all --all-namespaces
echo [-----------Check hpa--------------------]
kubectl get hpa
echo [-----------Show secrets-----------------]
kubectl get secrets
echo [----------------------------------------]
nginx=ingress-nginx
# echo [-----------Check Pods-$nginx-------------]
# kubectl get pods -n $nginx

# echo [------Check Deployments-$nginx-----------]
# kubectl get deployments -n $nginx

# echo [-------Check Services-$nginx-------------]
# kubectl get services -n $nginx

echo [------Check describe-$nginx----------]
kubectl describe service -n $nginx

echo [-----------------------------------------]
echo [-----------Check Application-------------]
echo [-----------------------------------------]


# echo [-----------Check Pods--------------------]
# kubectl get pods

# echo [-----------Check Deployments-------------]
# kubectl get deployments

# echo [-----------Check Services----------------]
# kubectl get services
# echo [-----------------------------------------]

# echo [-----------Check Replicaset--------------]
# kubectl get replicaset
# echo [-----------------------------------------]

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

orders=orders
echo [-----------Check $orders----------------]
kubectl describe service $orders
kubectl describe deployment $orders-depl
echo [-----------------------------------------]

echo [-----------Check $orders-mongo----------]
kubectl describe service $orders-mongo
kubectl describe deployment $orders-mongo-depl
echo [-----------------------------------------]


client=client
echo [------------Check $client----------------]
kubectl describe service $client
kubectl describe deployment $client-depl
echo [-----------------------------------------]

nats=nats
echo [------------Check $nats----------------]
kubectl describe service $nats
kubectl describe deployment $nats-depl
echo [-----------------------------------------]

echo [---Show running and stopped containers---]
docker ps -a
