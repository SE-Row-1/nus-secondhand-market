# Account Service

Account service is responsible for account-related operations, such as registration, profile management, log in/out, etc.

## Events

### Exchange

- Name: account
- Type: topic
- Durable: true

### Topic: updated

- Description: A user has updated the profile with new information.
- Message format: JSON-serialized item.

```json
{
  {
    "id": 1,
    "nickname": "mrcaidev",
    "avatar_url": "https://avatars.githubusercontent.com/u/78269445?v=4"
  }
}
```

### Topic: deleted

- Description: A user has deleted the account.
- Message format: Account ID.

```
1
```
