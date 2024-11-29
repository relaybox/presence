import { Logger } from 'winston';
import { dispatch } from '@/lib/publisher';
import * as repository from './repository';
import { KeyPrefix, KeySuffix } from './types';
import { RedisClient } from '@/lib/redis';

export function formatKey(keyParts: string[]): string {
  return keyParts.join(':');
}

export async function addActiveMember(
  logger: Logger,
  redisClient: RedisClient,
  data: any
): Promise<void> {
  const { clientId, nspRoomId, subscription, session, message, latencyLog } = data;

  const { connectionId } = session;

  logger.debug(`Adding active member, ${clientId}, ${nspRoomId}`, { clientId, nspRoomId });

  const addActiveMemberKey = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.MEMBERS]);
  const pushActiveMemberKey = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.INDEX]);
  const connectionActiveKey = formatKey([
    KeyPrefix.CONNECTION,
    connectionId,
    KeySuffix.PRESENCE_SETS
  ]);

  const messageData = {
    ...message,
    user: session.user,
    connectionId: session.connectionId
  };

  try {
    await repository.addActiveMember(
      redisClient,
      addActiveMemberKey,
      connectionId,
      JSON.stringify(messageData)
    );
    await repository.pushActiveMember(redisClient, pushActiveMemberKey, connectionId);
    await repository.setConnectionActive(redisClient, connectionActiveKey, nspRoomId);

    dispatch(nspRoomId, subscription, message, session, latencyLog);
  } catch (err: any) {
    logger.error(`Failed to add active presence member`, { clientId, err });
  }
}

export async function removeActiveMember(
  logger: Logger,
  redisClient: RedisClient,
  data: any
): Promise<void> {
  const { clientId, nspRoomId, subscription, session, message, latencyLog } = data;

  const { connectionId } = session;

  logger.debug(`Removing active member ${clientId}, ${nspRoomId}`, { clientId, nspRoomId });

  const removeActiveMemberKey = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.MEMBERS]);
  const shiftActivememberKey = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.INDEX]);
  const connectionActiveKey = formatKey([
    KeyPrefix.CONNECTION,
    connectionId,
    KeySuffix.PRESENCE_SETS
  ]);

  try {
    await repository.removeActiveMember(redisClient, removeActiveMemberKey, connectionId);
    await repository.shiftActiveMember(redisClient, shiftActivememberKey, connectionId);
    await repository.setConnectionInactive(redisClient, connectionActiveKey, nspRoomId);

    dispatch(nspRoomId, subscription, message, session, latencyLog);
  } catch (err) {
    logger.error(`Failed to remove active presence member`, { clientId, err });
  }
}

export async function updateActiveMember(
  logger: Logger,
  redisClient: RedisClient,
  data: any
): Promise<void> {
  const { clientId, nspRoomId, subscription, session, message, latencyLog } = data;

  const { connectionId } = session;

  logger.debug(`Updating active member ${clientId}, ${nspRoomId}`, { clientId, nspRoomId });

  const key = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.MEMBERS]);

  try {
    const messageData = {
      ...message,
      user: session.user,
      connectionId: session.connectionId
    };

    await repository.updateActiveMember(
      redisClient,
      key,
      connectionId,
      JSON.stringify(messageData)
    );

    dispatch(nspRoomId, subscription, message, session, latencyLog);
  } catch (err) {
    logger.error(`Failed to update active presence member`, { clientId, err });
  }
}
