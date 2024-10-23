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
# Loop through each service directory and encrypt its .env file
for service_dir in "${service_dirs[@]}"; do
  SERVICE_NAME=$(basename "$service_dir")
  ENV_FILE="$service_dir/.env"
  # Check if .env file exists
  if [ -f "$ENV_FILE" ]; then
    echo "Encrypting $ENV_FILE..."
    gpg --batch --yes --passphrase-file "$PASSPHRASE_FILE" --symmetric --output "envs/$SERVICE_NAME.env.gpg" "$ENV_FILE"
    if [ $? -eq 0 ]; then
      echo "$ENV_FILE encrypted successfully and moved to envs/$SERVICE_NAME.env.gpg"
    else
      echo "Failed to encrypt $ENV_FILE for $SERVICE_NAME. Exiting..."
      exit 1
    fi
  else
    echo "No .env file found in $service_dir, skipping..."
  fi
done
echo "All services processed."

