# Notification Service

This service is responsible for sending notifications to users.

Currently, it only supports Email notifications. If time permits, supports will also be added for SMS, WhatsApp and other notification channels.

## How to Use

This service does not expose any port, not even for other services. The only way to interact with this service is through RabbitMQ.

For any service that would like to send a notification, that service can publish the notification details to a dedicated exchange, and the exchange will route that message to the notification service.

Each notification is guaranteed to be processed **exactly once**.

## Exchange

- Name: notification
- Type: topic
- Durable: true

## Topic: email

Send an email to one user.

```json
{
  "to": "someone@example.com",
  "title": "Email subject",
  "content": "<p>Email content in HTML or plain text</p>"
}
```

## Topic: batch-email

Send multiple emails to multiple users at once, in batch.

```json
{
  "emails": [
    {
      "to": "someone1@example.com",
      "title": "Email subject 1",
      "content": "<p>Email content in HTML or plain text</p>"
    },
    {
      "to": "someone2@example.com",
      "title": "Email subject 2",
      "content": "<p>Email content in HTML or plain text</p>"
    }
  ]
}
