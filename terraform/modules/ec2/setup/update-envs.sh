#!/bin/bash

# Step 1: Decrypt .gpg files
for file in envs/*.gpg; do
    gpg --batch --yes --decrypt --passphrase-file=nshm.passphrase --output "${file%.gpg}" "$file"
done

# Step 2: Retrieve new values from EC2 script
# Execute the EC2 script and export the new values
RDS_ENDPOINT=$(aws rds describe-db-instances --query "DBInstances[?DBInstanceIdentifier=='nus-secondhand-market-db'].Endpoint.Address" --output text)
DB_NAME=nshm
DB_PORT=5432
DB_USERNAME=nshmadmin
DB_PASSWORD=$(aws s3 cp s3://nus-backend-terraform/rds_password.txt - | tr -d '\n')
POSTGRES_URL="jdbc:postgresql://$RDS_ENDPOINT:$DB_PORT/$DB_NAME"
RABBITMQ_URL=amqp://rabbitmq:rabbitmq@rabbitmq.nshm.svc.cluster.local:5672
NEXT_PUBLIC_API_BASE_URL=http://www.nshm.store/api
API_BASE_URL=http://www.nshm.store/api

# Step 3: Update each .env file with the new values
for env_file in envs/*.env; do
    # Check if the env file contains the keys to be updated
    if grep -q "POSTGRES_URL" "$env_file"; then
        sed -i "s|^POSTGRES_URL=.*|POSTGRES_URL=$POSTGRES_URL|" "$env_file"
    fi
    if grep -q "POSTGRES_USERNAME" "$env_file"; then
        sed -i "s|^POSTGRES_USERNAME=.*|POSTGRES_USERNAME=$DB_USERNAME|" "$env_file"
    fi
    if grep -q "POSTGRES_PASSWORD" "$env_file"; then
        sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$DB_PASSWORD|" "$env_file"
    fi
    if grep -q "RABBITMQ_URL" "$env_file"; then
        sed -i "s|^RABBITMQ_URL=.*|RABBITMQ_URL=$RABBITMQ_URL|" "$env_file"
    fi
    if grep -q "NEXT_PUBLIC_API_BASE_URL" "$env_file"; then
        sed -i "s|^NEXT_PUBLIC_API_BASE_URL=.*|NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL|" "$env_file"
    fi
    if grep -q "API_BASE_URL" "$env_file"; then
        sed -i "s|^API_BASE_URL=.*|API_BASE_URL=$API_BASE_URL|" "$env_file"
    fi
done

echo "Environment files updated successfully."

