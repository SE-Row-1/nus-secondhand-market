#!/bin/bash

# Check if the passphrase file exists
PASSPHRASE_FILE="nshm.passphrase"
S3_BUCKET="s3://nus-backend-terraform"
SERVICES_DIR="services"

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

# Get a list of service directories
service_dirs=($(ls -d "$SERVICES_DIR"/*))

# Prompt user to select a service
echo "Please select a service to encrypt its .env file:"
for i in "${!service_dirs[@]}"; do
  echo "$((i + 1))) ${service_dirs[$i]}"
done

read -p "Enter the number corresponding to the service: " service_num

# Get the service name from the array
SERVICE_NAME=$(basename "${service_dirs[$service_num - 1]}")

# Construct the full path to the .env file
ENV_FILE="$SERVICES_DIR/$SERVICE_NAME/.env"

# Encrypt the selected .env file and move it to the envs directory
echo "Encrypting $ENV_FILE..."
gpg --batch --yes --passphrase-file "$PASSPHRASE_FILE" --symmetric --output "envs/$SERVICE_NAME.env.gpg" "$ENV_FILE"

if [ $? -eq 0 ]; then
  echo "$ENV_FILE encrypted successfully and moved to envs/$SERVICE_NAME.env.gpg"
else
  echo "Failed to encrypt $ENV_FILE. Exiting..."
  exit 1
fi
