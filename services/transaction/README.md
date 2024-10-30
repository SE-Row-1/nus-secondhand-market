# Transaction Service

This microservice handles all transactions between sellers and buyers against second-hand items, including creation, completion, cancellation, etc.

## Events

### Transaction Completed

- Exchange: `transaction`
- Topic: `transaction.completed`

A transaction has been completed.

```json
{
  "id": "d5132957-8655-4d4a-8e89-b7fa8e2afd57",
  "item": {
    "id": "5469a9e3-28d2-4926-8ffd-3ba3c10119ed",
    "name": "item",
    "price": 100
  },
  "seller": {
    "id": 1,
    "nickname": "seller",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "buyer": {
    "id": 2,
    "nickname": "buyer",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "createdAt": "2024-10-01T00:00:00Z",
  "completedAt": "2024-10-03T00:00:00Z",
  "cancelledAt": null
}
```

### Transaction Cancelled

- Exchange: `transaction`
- Topic: `transaction.cancelled`

A transaction has been cancelled.

```json
{
  "id": "d5132957-8655-4d4a-8e89-b7fa8e2afd57",
  "item": {
    "id": "5469a9e3-28d2-4926-8ffd-3ba3c10119ed",
    "name": "item",
    "price": 100
  },
  "seller": {
    "id": 1,
    "nickname": "seller",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "buyer": {
    "id": 2,
    "nickname": "buyer",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "createdAt": "2024-10-01T00:00:00Z",
  "completedAt": null,
  "cancelledAt": "2024-10-03T00:00:00Z"
}
```

### Transaction Auto Completed

> [!NOTE]
>
> This event is only used internally. Subscribing to this event may result in unexpected behavior.
> If you are interested in transactions' completion, please subscribe to `transaction.completed` instead.

- Exchange: `delayed`
- Topic: `transaction.auto-completed`

A transaction has been automatically marked as completed after 14 days of inactivity.

```json
{
  "id": "d5132957-8655-4d4a-8e89-b7fa8e2afd57",
  "item": {
    "id": "5469a9e3-28d2-4926-8ffd-3ba3c10119ed",
    "name": "item",
    "price": 100
  },
  "seller": {
    "id": 1,
    "nickname": "seller",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "buyer": {
    "id": 2,
    "nickname": "buyer",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "createdAt": "2024-10-01T00:00:00Z",
  "completedAt": null,
  "cancelledAt": null
}
```
