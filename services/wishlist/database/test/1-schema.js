// Switch to the admin database to create the user
db = db.getSiblingDB('admin');

// Create the user for the test_nshm_wishlist database (if it doesn't exist yet)
db.createUser({
    user: "test_user",
    pwd: "test_password",  // Use the same password as the root user
    roles: [
        { role: "readWrite", db: "test_nshm_wishlist" }  // Assign appropriate role
    ]
});

// Switch to the target database
db = db.getSiblingDB('test_nshm_wishlist');  // Switch to the target database

// Create 'wishlist' collection (if it doesn't exist yet)
db.createCollection("wishlist");

// Create an index to ensure the combination of userId and itemId is unique
db.wishlist.createIndex({ userId: 1, itemId: 1 }, { unique: true });

// Create an index to speed up queries that fetch the latest favorite records for an item, sorted by wantedAt
db.wishlist.createIndex({ itemId: 1, wantedAt: -1 });

// Create a single-field index on userId to speed up queries that fetch all favorites of a specific user, sorted by wantedAt
db.wishlist.createIndex({ userId: 1, wantedAt: -1 });

// Print confirmation message
print("Wishlist collection initialized with updated indexes and user created.");

