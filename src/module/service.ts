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

  const keyPrefix = formatKey([KeyPrefix.PRESENCE, nspRoomId]);

  const messageData = {
    ...message,
    user: session.user
  };

  try {
    await repository.addActiveMember(
      redisClient,
      `${keyPrefix}:${KeySuffix.MEMBERS}`,
      clientId,
      JSON.stringify(messageData)
    );

    await repository.pushActiveMember(redisClient, `${keyPrefix}:${KeySuffix.INDEX}`, clientId);

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

  const keyPrefix = formatKey([KeyPrefix.PRESENCE, nspRoomId]);

  try {
    await repository.removeActiveMember(redisClient, `${keyPrefix}:${KeySuffix.MEMBERS}`, clientId);
    await repository.shiftActiveMember(redisClient, `${keyPrefix}:${KeySuffix.INDEX}`, clientId);

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

  const key = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.MEMBERS]);

  try {
    const messageData = {
      ...message,
      user: session.user
    };

    await repository.updateActiveMember(redisClient, key, clientId, JSON.stringify(messageData));

    dispatch(nspRoomId, subscription, message, session, latencyLog);
  } catch (err) {
    logger.error(`Failed to update active presence member`, { clientId, err });
  }
}
