kubectl apply -f ./infra/k8s/depl mongodb-deployment.yaml

echo [Deploy the client]
kubectl create -f ./infra/k8s/depl mongodb-client.yaml
echo [Exec into the client]
kubectl exec deployment/mongo-client -it -- /bin/bash
echo [Login into the MongoDB shell]
mongo --host mongo-nodeport-svc --port 27017 -u adminuser -p password123

echo [Display list of DBs]
show dbs
echo [Get inside a particular DB.]
use db1
echo [Display a list of collections inside the db1 database.]
show collections
echo [Get inside a particular DB.]