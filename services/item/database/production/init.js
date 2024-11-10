/* eslint-disable no-undef */

db.createCollection("items");

db.items.createIndex({ name: "text", description: "text" });
