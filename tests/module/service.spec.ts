import { getMockMessageData } from '../__mocks__/internal/message.mock';
import { describe, vi, it, afterEach, expect } from 'vitest';
import { getLogger } from '@/util/logger.util';
import {
  addActiveMember,
  formatKey,
  removeActiveMember,
  updateActiveMember
} from '@/module/service';
import { KeyPrefix, KeySuffix } from '@/module/types';
import { RedisClient } from '@/lib/redis';

const logger = getLogger('session-service');

const mockRepository = vi.hoisted(() => ({
  addActiveMember: vi.fn(),
  pushActiveMember: vi.fn(),
  removeActiveMember: vi.fn(),
  shiftActiveMember: vi.fn(),
  updateActiveMember: vi.fn(),
  setClientPresenceActive: vi.fn(),
  unsetClientPresenceActive: vi.fn(),
  setActiveConnection: vi.fn(),
  unsetActiveConnection: vi.fn()
}));

vi.mock('@/module/repository', () => mockRepository);

const mockPublisher = vi.hoisted(() => ({
  dispatch: vi.fn()
}));

vi.mock('@/lib/publisher', () => mockPublisher);

describe('service', () => {
  const mockRedisClient = {} as RedisClient;

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('addActiveMember', () => {
    it('should add active member to presence set by nspRoomId', async () => {
      const messageData = getMockMessageData();

      const { nspRoomId, subscription, session, message, latencyLog } = messageData;

      const { connectionId } = session;

      const addActiveMemberCacheKeyPrefix = formatKey([KeyPrefix.PRESENCE, messageData.nspRoomId]);

      const messageUserData = {
        ...message,
        user: session.user,
        connectionId
      };

      await addActiveMember(logger, mockRedisClient, messageData);

      expect(mockRepository.addActiveMember).toHaveBeenCalledWith(
        mockRedisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.MEMBERS}`,
        connectionId,
        JSON.stringify(messageUserData)
      );
      expect(mockRepository.pushActiveMember).toHaveBeenCalledWith(
        mockRedisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.INDEX}`,
        connectionId
      );
      expect(mockPublisher.dispatch).toHaveBeenCalledWith(
        nspRoomId,
        subscription,
        message,
        session,
        latencyLog
      );
    });
  });

  describe('removeActiveMember', () => {
    it('should remove active member from presence set by nspRoomId', async () => {
      const messageData = getMockMessageData();

      const { nspRoomId, subscription, session, message, latencyLog } = messageData;

      const { connectionId } = session;

      const addActiveMemberCacheKeyPrefix = formatKey([KeyPrefix.PRESENCE, messageData.nspRoomId]);

      await removeActiveMember(logger, mockRedisClient, messageData);

      expect(mockRepository.removeActiveMember).toHaveBeenCalledWith(
        mockRedisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.MEMBERS}`,
        connectionId
      );
      expect(mockRepository.shiftActiveMember).toHaveBeenCalledWith(
        mockRedisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.INDEX}`,
        connectionId
      );
      expect(mockPublisher.dispatch).toHaveBeenCalledWith(
        nspRoomId,
        subscription,
        message,
        session,
        latencyLog
      );
    });
  });

  describe('updateActiveMember', () => {
    it('should update active member presence data by nspRoomId', async () => {
      const messageData = getMockMessageData();

      const { nspRoomId, subscription, session, message, latencyLog } = messageData;

      const { connectionId } = session;

      const addActiveMemberCacheKeyPrefix = formatKey([KeyPrefix.PRESENCE, messageData.nspRoomId]);

      const messageUserData = {
        ...message,
        user: session.user,
        connectionId
      };

      await updateActiveMember(logger, mockRedisClient, messageData);

      expect(mockRepository.updateActiveMember).toHaveBeenCalledWith(
        mockRedisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.MEMBERS}`,
        connectionId,
        JSON.stringify(messageUserData)
      );

      expect(mockPublisher.dispatch).toHaveBeenCalledWith(
        nspRoomId,
        subscription,
        message,
        session,
        latencyLog
      );
    });
  });
});
