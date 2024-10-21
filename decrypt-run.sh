#!/bin/bash
DOCKER_COMPOSE_FILE=docker-compose.dev.yaml
ENVS_DIR="./envs"
PASSPHRASE_FILE="nshm.passphrase"
# Check if the passphrase file exists, if not, download it from S3
if [[ ! -f "$PASSPHRASE_FILE" ]]; then
  echo "Passphrase file not found. Downloading from S3..."
  aws s3 cp s3://nus-backend-terraform/nshm.passphrase .
  if [[ $? -ne 0 ]]; then
    echo "Failed to download passphrase file. Exiting."
    exit 1
  fi
fi
# Decrypt each .env.gpg file inside the envs directory
for env_file_gpg in "$ENVS_DIR"/*.env.gpg; do
  if [[ -f "$env_file_gpg" ]]; then
    # Extract the service name from the filename
    service_name=$(basename "$env_file_gpg" .env.gpg)
    service_dir="./services/$service_name"
    env_file="$service_dir/.env"

    # Check if the service directory exists
    if [[ -d "$service_dir" ]]; then
      # Decrypt to the service directory
      echo "Decrypting $env_file_gpg to $env_file..."
      gpg --batch --yes --decrypt --passphrase-file="$PASSPHRASE_FILE" --output "$env_file" "$env_file_gpg"
      if [[ $? -eq 0 ]]; then
        echo "$env_file decrypted successfully."
      else
        echo "Failed to decrypt $env_file_gpg."
        exit 1
      fi
    else
      # If the service directory doesn't exist, decrypt inside envs directory
      env_file="$ENVS_DIR/${service_name}.env"
      echo "Service directory $service_dir does not exist. Decrypting to $env_file..."
      gpg --batch --yes --decrypt --passphrase-file="$PASSPHRASE_FILE" --output "$env_file" "$env_file_gpg"
      if [[ $? -eq 0 ]]; then
        echo "$env_file decrypted successfully."
      else
        echo "Failed to decrypt $env_file_gpg."
        exit 1
      fi
    fi
  fi
done
# Check if the rabbitmq container is running, stop all containers if necessary
if [[ "$(docker ps -q -f name=rabbitmq)" ]]; then
  echo "Stopping running containers..."
  docker compose -f "$DOCKER_COMPOSE_FILE" down
fi
# Start the Docker Compose services
echo "Starting Docker Compose services..."
docker compose -f "$DOCKER_COMPOSE_FILE" up --build -d
echo "Docker Compose services started."
