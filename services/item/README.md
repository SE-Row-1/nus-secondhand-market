# Item Service

This microservice handles all item-related operations, including CRUD, text search, etc.

## Events

### Item Updated

An item has been updated.

- Exchange: `item`
- Topic: `item.updated`

```json
{
  "id": "eafd6cff-9e60-481c-af83-9eea3d7f9555",
  "type": "single",
  "name": "item",
  "description": "description",
  "price": 100,
  "photoUrls": ["https://example.com/item.jpg"],
  "seller": {
    "id": 1,
    "nickname": "seller",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "status": 0,
  "createdAt": "2024-10-16T05:19:16.165Z",
  "deletedAt": null
}
```

### Item Deleted

An item has been deleted.

- Exchange: `item`
- Topic: `item.deleted`

```json
"eafd6cff-9e60-481c-af83-9eea3d7f9555"
```
