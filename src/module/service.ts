import { Logger } from 'winston';
import { dispatch } from '../lib/publisher';
import * as repository from './repository';
import { KeyPrefix, KeySuffix } from './types';
import { RedisClient } from '../lib/redis';

export async function processAddActiveMember(
  logger: Logger,
  redisClient: RedisClient,
  data: any
): Promise<void> {
  const { clientId, nspRoomId, subscription, session, message, latencyLog } = data;

  const keyPrefix = formatKey([KeyPrefix.PRESENCE, nspRoomId]);

  try {
    await repository.addActiveMember(
      redisClient,
      `${keyPrefix}:${KeySuffix.MEMBERS}`,
      clientId,
      JSON.stringify(message)
    );

    await repository.pushActiveMember(redisClient, `${keyPrefix}:${KeySuffix.INDEX}`, clientId);

    dispatch(nspRoomId, subscription, message, session, latencyLog);
  } catch (err: any) {
    logger.error(`Failed to add active presence member`, { clientId, err });
  }
}

export async function processRemoveActiveMember(
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

export async function processUpdateActiveMember(
  logger: Logger,
  redisClient: RedisClient,
  data: any
): Promise<void> {
  const { clientId, nspRoomId, subscription, session, message, latencyLog } = data;

  const key = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.MEMBERS]);

  try {
    await repository.updateActiveMember(redisClient, key, clientId, JSON.stringify(message));

    dispatch(nspRoomId, subscription, message, session, latencyLog);
  } catch (err) {
    logger.error(`Failed to update active presence member`, { clientId, err });
  }
}

function formatKey(keyParts: string[]): string {
  return keyParts.join(':');
}
