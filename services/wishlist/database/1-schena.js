// Connect to the MongoDB database
db = connect("localhost:27017/nshm_wishlist");  // Replace with your actual database name

// Create 'wishlist' collection (if it doesn't exist yet)
db.createCollection("wishlist");

// Create an index to ensure the combination of userId and itemId is unique
db.wishlist.createIndex({ userId: 1, itemId: 1 }, { unique: true });

// Create an index to speed up queries that fetch the latest favorite records for an item, sorted by favoriteDate
db.wishlist.createIndex({ itemId: 1, favoriteDate: -1 });

// Create a single-field index on userId to speed up queries that fetch all favorites of a specific user
db.wishlist.createIndex({ userId: 1 });



// Print confirmation message
print("Wishlist collection initialized with indexes.");
