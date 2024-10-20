#!/bin/bash

# Loop through all .env files in the current directory
for env_file in envs/*.env; do
  # Extract the base name without the .env extension
  base_name=$(basename "$env_file" .env)
  # Create a secret for each .env file
  kubectl create secret generic "$base_name-secret" --from-env-file="$env_file" -n nshm --dry-run=client -o yaml | kubectl apply -f -

done

