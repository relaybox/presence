import { getMockSession } from './session.mock';

interface MockMessageDataOptions {
  clientId?: string;
  nspRoomId?: string;
  subscription?: string;
  connectionId?: string;
}

export function getMockMessageData({
  clientId,
  nspRoomId,
  subscription,
  connectionId
}: MockMessageDataOptions = {}): any {
  clientId = clientId || '12345';
  nspRoomId = nspRoomId || 'test:123';
  subscription = subscription || 'test';
  connectionId = connectionId || 'connection:12345';

  const session = getMockSession({ clientId, connectionId }, { clientId });
  const now = new Date().toISOString();
  const latencyLog = {
    createdAt: now,
    receivedAt: now
  };
  const message = {
    test: true
  };

  return {
    clientId,
    connectionId,
    nspRoomId,
    subscription,
    session,
    message,
    latencyLog
  };
}
