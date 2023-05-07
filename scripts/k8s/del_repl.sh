#!/bin/sh

set -euo pipefail

echo "What keyspace should we query?"
read namespace

echo "These will be deleted."
kubectl get replicaset -n "${namespace}" | awk '{ if ($4 == 0) { print } }'

echo "Do you wish to continue? [Y/N]"
read response
if [ "${response}" == "y" ]; then
  kubectl get replicaset -n "${namespace}" | awk '{ if ($4 == 0) { print $1 } }' | xargs kubectl delete -n "${namespace}" replicaset
fi