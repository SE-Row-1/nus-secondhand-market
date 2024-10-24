/* eslint-disable no-undef */

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

db.createCollection("items");

db.items.createIndex({ name: "text", description: "text" });

if (db.getUser(process.env.MONGO_INITDB_ROOT_USERNAME) === null) {
  db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [
      {
        role: "readWrite",
        db: process.env.MONGO_INITDB_DATABASE
      }
    ]
  });
  print("User created: " + process.env.MONGO_INITDB_ROOT_USERNAME);
} else {
  print("User already exists: " + process.env.MONGO_INITDB_ROOT_USERNAME);
}

print("Database and user initialization complete.");
