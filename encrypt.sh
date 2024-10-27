#!/bin/bash

# Define passphrase file, S3 bucket, services directory, and envs directory
PASSPHRASE_FILE="nshm.passphrase"
S3_BUCKET="s3://nus-backend-terraform"
SERVICES_DIR="services"
ENVS_DIR="envs"

# Check if the passphrase file exists; download from S3 if not
if [ ! -f "$PASSPHRASE_FILE" ]; then
  echo "Passphrase file not found, downloading from S3..."
  aws s3 cp "${S3_BUCKET}/${PASSPHRASE_FILE}" .
  if [ $? -ne 0 ]; then
    echo "Failed to download passphrase file from S3. Exiting..."
    exit 1
  fi
  echo "Passphrase file downloaded successfully."
else
  echo "Passphrase file already exists."
fi


# Function to encrypt a single .env file
encrypt_env_file() {
  local env_file=$1
  local service_name=$2
  echo "Encrypting $env_file..."

  # Encrypt the .env file, outputting to the encrypted_envs directory
  gpg --batch --yes --passphrase-file "$PASSPHRASE_FILE" --symmetric --output "$ENVS_DIR/${service_name}.env.gpg" "$env_file"

  # Check if encryption was successful
  if [ $? -eq 0 ]; then
    echo "$env_file encrypted successfully and saved as $ENVS_DIR/${service_name}.env.gpg"
  else
    echo "Failed to encrypt $env_file for $service_name. Exiting..."
    exit 1
  fi
}

# Encrypt .env files within subdirectories of services
service_dirs=($(ls -d "$SERVICES_DIR"/*/))
for service_dir in "${service_dirs[@]}"; do
  SERVICE_NAME=$(basename "$service_dir")
  ENV_FILE="$service_dir/.env"
  if [ -f "$ENV_FILE" ]; then
    encrypt_env_file "$ENV_FILE" "$SERVICE_NAME"
  else
    echo "No .env file found in $service_dir, skipping..."
  fi
done

# Encrypt .env files in the envs directory
for env_file in "$ENVS_DIR"/*.env; do
  if [ -f "$env_file" ]; then
    SERVICE_NAME=$(basename "$env_file" .env)
    encrypt_env_file "$env_file" "$SERVICE_NAME"
  else
    echo "No .env files found in $ENVS_DIR."
  fi
done

echo "All .env files processed and encrypted."

