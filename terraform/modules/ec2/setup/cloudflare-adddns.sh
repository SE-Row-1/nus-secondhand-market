#!/bin/bash

ARGO_INGRESS=$(kubectl get ingress -n argocd -o json | jq -r '.items[].status.loadBalancer.ingress[].hostname')

CLOUDFLARE_API_URL="https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records"

curl -X POST "$CLOUDFLARE_API_URL" \
-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
-H "Content-Type: application/json" \
--data "{
    \"type\": \"${RECORD_TYPE}\",
    \"name\": \"${RECORD_NAME}\",
    \"content\": \"${ARGO_INGRESS}\",
    \"ttl\": ${TTL},
    \"proxied\": true
}"
