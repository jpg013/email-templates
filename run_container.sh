#!/usr/bin/env bash
docker run -p 3000:3000 --net=host --env-file ./.env -m "300M" --memory-swap "1G" email-templates
