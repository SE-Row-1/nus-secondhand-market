# Notification Service

This service is responsible for sending notifications to users.

Currently, it only supports Email notifications. If time permits, supports will also be added for SMS, WhatsApp and other notification channels.

## How to Use

This service does not expose any port, not even for other services. The only way to interact with this service is through RabbitMQ.

For any service that would like to send a notification, that service can publish the notification details to a dedicated exchange, and the exchange will route that message to the notification service.

Each notification is guaranteed to be processed **exactly once**.

## Exchange

| Property    | Value        |
|-------------|--------------|
| name        | notification |
| type        | topic        |
| durable     | true         |
| auto delete | false        |
| internal    | false        |
| no wait     | false        |
| args        | (none)       |

## Topic

The topic name indicates the eventual notification channel.

| Topic name | Notification channel |
|------------|----------------------|
| email      | Email                |

## Message

It is recommended to mark all messages as `persistent`.

For email topic:

```json
{
  "to": "someone@example.com",
  "title": "Email subject",
  "content": "<p>Email content in HTML or plain text</p>"
}
```
