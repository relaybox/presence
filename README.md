# Presence - RelayBox Presence Service

The presence service is one of four core services that keep the core database up to date with the latest data broadcast by the [Core](https://github.com/relaybox/core) Realtime Service.

For more information about RelayBox "presence" and associated functionality please visit the [Presence Documentation](https://relaybox.net/docs/presence).

## Getting Started

### Prerequisites

- Node.js 20.x
- Docker (optional)

### Configuration

Create a copy of `.env.template` in the root of the project and rename it to `.env`. Adjust the configuration settings to match your local environment. Further information about each environment variable can be found in `.env.template`.

### Installation

To install the necessary packages, simply run...

```
npm install
```

Once complete, the dev environment is ready to go. To start the service, run the following command...

```
npm run dev
```

## Testing

The service unit tests can be found in the `./test` directory. Tests are run using the `vitest` runner.

```
npm run test
```

## About "Presence"

Presence provides realtime visiblity into members of a room through "join", "leave" and "update" events. Each event, at a minimum contains meta data about the connection and client that triggered the event. Event data can also be extended to include authenticated user data and arbitrary values attached to each event as desired.

Essentially, presence is idenitifiable realtime event transmission for [rooms](https://relaybox.net/docs/rooms).

## About the service

The Presence service is a Node.js worker triggered by jobs reveived from BullMQ. Jobs are added to the queue in response to events received by the [Core](https://github.com/relaybox/core) realtime service.

<!-- ![RelayBox system diagram, highlight Presence](/assets/system/relaybox-system-presence.png) -->

The following events and corresponding job data are processed by the service:

- `presence:join`

Adds a member to a presence set and broadcasts the event to relevant subscribers.

- `presence:leave`

Removes a member to from a presence set and broadcasts the event to relevant subscribers.

- `presence:update`

Updates the user data attached to a member in a presence set and broadcasts the event to relevant subscribers.

### Presence Data

Transmitted presence data maintains the following structure, only the `data`, `event` and `type` attributes will vary across the different events:

```json
{
  "type": "presence:join",
  "body": {
    "id": "Fef8GnS7C5zN:-DmWHl490veI",
    "data": {
      "message": "2024-10-03T14:49:14.325Z"
    },
    "timestamp": "2024-10-03T14:49:14.329Z",
    "event": "join | leave | update",
    "user": {
      "id": "a2c10890-3bb0-4c0d-ad84-5424433673ad",
      "clientId": "-DmWHl490veI",
      "createdAt": "2024-09-16T14:10:35.522Z",
      "updatedAt": "2024-09-16T14:10:35.522Z",
      "username": "TrickySalmon267",
      "orgId": "6a52666d-79a5-4e08-bfe7-70d6d0756400",
      "appId": "43c7315e-c680-4279-87f9-256e9e3fc2ec",
      "isOnline": true,
      "lastOnline": "2024-10-03T13:57:20.516Z",
      "blockedAt": null
    }
  }
}
```
