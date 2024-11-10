/* eslint-disable no-undef */
db = db.getSiblingDB('nshm_item');

db.createCollection("items");

db.items.createIndex({ name: "text", description: "text" });
