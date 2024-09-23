import { getMockMessageData } from '@/test/__mocks__/internal/message.mock';
import { describe, vi, it, afterEach, expect } from 'vitest';
import { getLogger } from '@/util/logger.util';
import {
  addActiveMember,
  formatKey,
  removeActiveMember,
  updateActiveMember
} from '@/module/service';
import { KeyPrefix, KeySuffix } from '@/module/types';

const logger = getLogger('session-service');

const mockRepository = vi.hoisted(() => ({
  addActiveMember: vi.fn(),
  pushActiveMember: vi.fn(),
  removeActiveMember: vi.fn(),
  shiftActiveMember: vi.fn(),
  updateActiveMember: vi.fn()
}));

vi.mock('@/module/repository', () => mockRepository);

const mockPublisher = vi.hoisted(() => ({
  dispatch: vi.fn()
}));

vi.mock('@/lib/publisher', () => mockPublisher);

describe('service', () => {
  const mockredisClient = {} as any;

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('addActiveMember', () => {
    it('should add active member to presence set by nspRoomId', async () => {
      const messageData = getMockMessageData();

      const { clientId, nspRoomId, subscription, session, message, latencyLog } = messageData;

      const addActiveMemberCacheKeyPrefix = formatKey([KeyPrefix.PRESENCE, messageData.nspRoomId]);

      const messageUserData = {
        ...message,
        user: session.user
      };

      await addActiveMember(logger, mockredisClient, messageData);

      expect(mockRepository.addActiveMember).toHaveBeenCalledWith(
        mockredisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.MEMBERS}`,
        clientId,
        JSON.stringify(messageUserData)
      );
      expect(mockRepository.pushActiveMember).toHaveBeenCalledWith(
        mockredisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.INDEX}`,
        clientId
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

      const { clientId, nspRoomId, subscription, session, message, latencyLog } = messageData;

      const addActiveMemberCacheKeyPrefix = formatKey([KeyPrefix.PRESENCE, messageData.nspRoomId]);

      await removeActiveMember(logger, mockredisClient, messageData);

      expect(mockRepository.removeActiveMember).toHaveBeenCalledWith(
        mockredisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.MEMBERS}`,
        clientId
      );
      expect(mockRepository.shiftActiveMember).toHaveBeenCalledWith(
        mockredisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.INDEX}`,
        clientId
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

      const { clientId, nspRoomId, subscription, session, message, latencyLog } = messageData;

      const addActiveMemberCacheKeyPrefix = formatKey([KeyPrefix.PRESENCE, messageData.nspRoomId]);

      const messageUserData = {
        ...message,
        user: session.user
      };

      await updateActiveMember(logger, mockredisClient, messageData);

      expect(mockRepository.updateActiveMember).toHaveBeenCalledWith(
        mockredisClient,
        `${addActiveMemberCacheKeyPrefix}:${KeySuffix.MEMBERS}`,
        clientId,
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
