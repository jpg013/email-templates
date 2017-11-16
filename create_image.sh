#!/usr/bin/env bash

docker rm -f email-templates

docker rmi email-templates

docker image prune

docker volume prune

docker build -t email-templates .
