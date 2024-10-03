# Presence - Presence Management Service by RelayBox

The presence service is one of four core services that keep the core database up to date with the latest data broadcast by the UWS Realtime Service.

## Getting Started

Create a copy of .env.tempate in the root of the project and rename it to .env. Add the following configuration options...

```
# Local DB host
DB_HOST=

# Local DB name
DB_NAME=

# Local DB port
DB_PORT=

# Local DB proxy enabled - Set to false for local development
DB_PROXY_ENABLED=

# Local DB user
DB_USER=

# Local DB password
DB_PASSWORD=

# Local DB max connections
DB_MAX_CONNECTIONS=

# Local DB idle timeout
DB_IDLE_TIMEOUT_MS=

# Local DB TLS disabled - Set to true for local development unless connecttion over TLS
DB_TLS_DISABLED=

# Local Redis host
REDIS_HOST=

# Local Redis port
REDIS_PORT=

# Local DB TLS disabled - Set to true for local development unless connecttion over TLS
REDIS_TLS_DISABLED=

# Local RabbitMQ connection string
RABBIT_MQ_CONNECTION_STRING=

# Recommended setting 5 - This value needs to be synced across services
RABBIT_MQ_QUEUE_COUNT=

# Localhost - Set to true for local development
LOCALHOST=

# Desired log level - recommended setting "debug" for local development
LOG_LEVEL=
```

## Installation

To install the necessary packages, simply run...

```
npm install
```

Once complete, the dev environment is ready to go. To start the service, run the following command...

```
npm run dev
```

## Testing

Unit tests are built using `vitest`.

```
npm run test
```

## About "Presence"

Presence provides a way to manage and provide visiblity to members of a room through "join", "leave" and "update" events. Each event, at a minimum contains meta data about the connection and client that triggered the event. Event data can also be extended to include authenticated user data and arbitrary data added to each event as desired.

Essentially, presence is idenitifiable realtime event transmission for rooms.

The following jobs are handled by the service:

## presence:join

Adds a member to a presence set and broadcasts the message to relevant subscribers.

## presence:leave

Removes a member to from a presence set and broadcasts the message to relevant subscribers.

## presence:update

Updates the user data attached to a member in a presence set and broadcasts the message to relevant subscribers.

## Presence Data

Transmitted presence data maintains the following structure, only the data and type attributes will vary across the different events:

```
{
  "type": "presence:join",
  "body": {
    "id": "Fef8GnS7C5zN:-DmWHl490veI",
    "data": {
      "message": "2024-10-03T14:49:14.325Z"
    },
    "timestamp": "2024-10-03T14:49:14.329Z",
    "event": "join",
    "user": {
      "id": "a2c10890-3bb0-4c0d-ad84-5424433673ad",
      "clientId": "-DmWHl490veI",
      "createdAt": "2024-09-16T14:10:35.522Z",
      "updatedAt": "2024-09-16T14:10:35.522Z",
      "username": "chippedvolcano425",
      "orgId": "6a52666d-79a5-4e08-bfe7-70d6d0756400",
      "appId": "43c7315e-c680-4279-87f9-256e9e3fc2ec",
      "isOnline": true,
      "lastOnline": "2024-10-03T13:57:20.516Z",
      "blockedAt": null
    }
  }
}
```
