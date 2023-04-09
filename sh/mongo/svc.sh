kubectl create -f ./infra/k8s/svc  mongodb-nodeport-svc.yaml

# minikube ip
# minikube service --url mongo-nodeport-svc

# Command to connect:
# mongo --host <ip> --port <port of nodeport svc> -u adminuser -p password123