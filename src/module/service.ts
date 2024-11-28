import { Logger } from 'winston';
import { dispatch } from '@/lib/publisher';
import * as repository from './repository';
import { KeyNameSpace, KeyPrefix, KeySuffix } from './types';
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

  logger.debug(`Adding active member, ${clientId}, ${nspRoomId}`, { clientId, nspRoomId });

  const addActiveMemberKey = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.MEMBERS]);
  const pushActiveMemberKey = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.INDEX]);
  const clientPresenceKey = formatKey([
    KeyPrefix.CLIENT,
    session.appPid,
    clientId,
    KeyNameSpace.PRESENCE
  ]);

  const messageData = {
    ...message,
    user: session.user
  };

  try {
    await repository.addActiveMember(
      redisClient,
      addActiveMemberKey,
      clientId,
      JSON.stringify(messageData)
    );

    await repository.pushActiveMember(redisClient, pushActiveMemberKey, clientId);
    await repository.setClientPresenceActive(redisClient, clientPresenceKey, nspRoomId);

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

  logger.debug(`Removing active member ${clientId}, ${nspRoomId}`, { clientId, nspRoomId });

  const removeActiveMemberKey = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.MEMBERS]);
  const shiftActivememberKey = formatKey([KeyPrefix.PRESENCE, nspRoomId, KeySuffix.INDEX]);
  const clientPresenceKey = formatKey([
    KeyPrefix.CLIENT,
    session.appPid,
    clientId,
    KeyNameSpace.PRESENCE
  ]);

  try {
    await repository.removeActiveMember(redisClient, removeActiveMemberKey, clientId);
    await repository.shiftActiveMember(redisClient, shiftActivememberKey, clientId);
    await repository.unsetClientPresenceActive(redisClient, clientPresenceKey, nspRoomId);

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

  logger.debug(`Updating active member ${clientId}, ${nspRoomId}`, { clientId, nspRoomId });

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
