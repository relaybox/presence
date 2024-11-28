import { RedisClient } from '@/lib/redis';

export async function addActiveMember(
  redisClient: RedisClient,
  key: string,
  clientId: string,
  data: any
): Promise<void> {
  await redisClient.hSet(key, clientId, data);
}

export async function pushActiveMember(
  redisClient: RedisClient,
  key: string,
  clientId: string
): Promise<void> {
  await redisClient.lRem(key, 0, clientId);
  await redisClient.lPush(key, clientId);
}

export async function removeActiveMember(
  redisClient: RedisClient,
  key: string,
  clientId: string
): Promise<void> {
  await redisClient.hDel(key, clientId);
}

export async function shiftActiveMember(
  redisClient: RedisClient,
  key: string,
  clientId: string
): Promise<void> {
  await redisClient.lRem(key, 0, clientId);
}

export async function updateActiveMember(
  redisClient: RedisClient,
  key: string,
  clientId: string,
  data: any
): Promise<void> {
  await redisClient.hSet(key, clientId, data);
}

export function setClientPresenceActive(
  redisClient: RedisClient,
  key: string,
  nspRoomId: string
): Promise<number> {
  return redisClient.hSet(key, nspRoomId, 1);
}

export function unsetClientPresenceActive(
  redisClient: RedisClient,
  key: string,
  nspRoomId: string
): Promise<number> {
  return redisClient.hDel(key, nspRoomId);
}

export function setConnectionActive(
  redisClient: RedisClient,
  key: string,
  nspRoomId: string
): Promise<number> {
  return redisClient.hSet(key, nspRoomId, 1);
}

export function setConnectionInactive(
  redisClient: RedisClient,
  key: string,
  nspRoomId: string
): Promise<number> {
  return redisClient.hDel(key, nspRoomId);
}
