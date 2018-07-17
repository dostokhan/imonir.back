#! /bin/bash

echo 'Down imonirback'
docker-compose down
echo "Removing imonirback_node_modules VOLUME"
docker volume rm imonirback_node_modules

echo "Remove imonirback_backend docker IMAGE";
docker image rm imonirback_backend

echo "Run Up Script"
