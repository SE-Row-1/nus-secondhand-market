# Item Service

Item service is responsible for item-related operations, such as regular CRUD, keyword search, state transition, etc.

## Events

### Exchange

- Name: item
- Type: topic
- Durable: true

### Topic: updated

- Description: An item has been updated with new information.
- Message format: JSON-serialized item.

```json
{
  {
    "id": "eafd6cff-9e60-481c-af83-9eea3d7f9555",
    "type": "single",
    "name": "update",
    "description": "update",
    "price": 200,
    "photoUrls": [ "uploads/after-update.png" ],
    "seller": {
      "id": 1,
      "nickname": "me",
      "avatarUrl": "https://example.com/me.jpg",
    },
    "status": 0,
    "createdAt": "2024-10-16T05:19:16.165Z",
    "deletedAt": null,
  }
}
```

### Topic: deleted

- Description: An item has been soft-deleted.
- Message format: Item ID.

```
eafd6cff-9e60-481c-af83-9eea3d7f9555
```
