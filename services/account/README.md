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
    "email": "e1351826@u.nus.edu",
    "nickname": "mrcaidev",
    "avatar_url": "https://avatars.githubusercontent.com/u/78269445?v=4",
    "department_id": 1,
    "phone_code": "65",
    "phone_number": "80843976",
    "preferred_currency": "CNY",
    "created_at": "2024-09-23 12:19:10.415264+00",
    "deleted_at": null
  }
}
```

### Topic: deleted

- Description: A user has deleted the account.
- Message format: Account ID.

```
1
```
