#!/usr/bin/env bash

docker run -p 3000:3000 --env-file ./env -m "300M" --memory-swap "1G" email-templates
