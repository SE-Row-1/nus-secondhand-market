#!/bin/bash

# Check if the passphrase file exists
PASSPHRASE_FILE="nshm.passphrase"
S3_BUCKET="s3://nus-backend-terraform"

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

# List of services with corresponding .env files
declare -A services=(
    [1]="account.env"
    [2]="currency.env"
    [3]="infra.env"
    [4]="item.env"
    [5]="web.env"
    [6]="wishlist.env"
)

# Prompt user to select a service
echo "Please select a service to encrypt its .env file:"
for i in {1..6}; do
    echo "$i) ${services[$i]}"
done

read -p "Enter the number corresponding to the service: " service_num

# Check if the selected service is valid
if [[ -z "${services[$service_num]}" ]]; then
    echo "Invalid selection. Exiting..."
    exit 1
fi

ENV_FILE="${services[$service_num]}"

# Encrypt the selected .env file using the passphrase file
echo "Encrypting $ENV_FILE..."
gpg --batch --yes --passphrase-file "$PASSPHRASE_FILE" --symmetric "$ENV_FILE"


if [ $? -eq 0 ]; then
    echo "$ENV_FILE encrypted successfully."
else
    echo "Failed to encrypt $ENV_FILE. Exiting..."
    exit 1
fi
