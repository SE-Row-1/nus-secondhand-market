// Switch to the target database
db = db.getSiblingDB('test_nshm_wishlist');

// Create 'wishlist' collection (if it doesn't exist yet)
db.createCollection("wishlist");

// Create an index to ensure the combination of userId and itemId is unique
db.wishlist.createIndex({ userId: 1, itemId: 1 }, { unique: true });

// Create an index to speed up queries that fetch the latest favorite records for an item, sorted by wantedAt
db.wishlist.createIndex({ itemId: 1, wantedAt: -1 });

// Create a single-field index on userId to speed up queries that fetch all favorites of a specific user, sorted by wantedAt
db.wishlist.createIndex({ userId: 1, wantedAt: -1 });

// Check if the user already exists
var user = db.getUser("test_user");

if (!user) {
    // Create user with readWrite role on the test_nshm_wishlist database
    db.createUser({
        user: "test_user",
        pwd: "test_password", // Replace with a secure password in production
        roles: [
            { role: "readWrite", db: "test_nshm_wishlist" }
        ]
    });
    print("User 'test_user' created with readWrite access.");
} else {
    print("User 'test_user' already exists.");
}

// Print confirmation message
print("Wishlist collection initialized with updated indexes.");

