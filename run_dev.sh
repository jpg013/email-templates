#!/usr/bin/env bash

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker image prune
docker volume prune
docker rmi $(docker images -a -q) -f
docker-compose up
