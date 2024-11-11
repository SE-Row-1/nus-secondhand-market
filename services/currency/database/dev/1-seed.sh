#!/bin/sh

# Define the key for the hash map
REDIS_KEY="subscription"

# Connect to Redis and add data to the hash map
redis-cli HSET $REDIS_KEY "SGDJPY" "1"
redis-cli HSET $REDIS_KEY "SGDSGD" "1"
redis-cli HSET $REDIS_KEY "SGDERU" "1"
redis-cli HSET $REDIS_KEY "SGDHKD" "1"
redis-cli HSET $REDIS_KEY "SGDCNY" "1"

echo "Data seeded to Redis HashMap 'subscription'"
