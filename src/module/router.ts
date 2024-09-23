import { Logger } from 'winston';
import { addActiveMember, removeActiveMember, updateActiveMember } from './service';
import { RedisClient } from '@/lib/redis';

enum JobName {
  PRESENCE_JOIN = 'presence:join',
  PRESENCE_LEAVE = 'presence:leave',
  PRESENCE_UPDATE = 'presence:update'
}

export function route<T>(
  logger: Logger,
  redisClient: RedisClient,
  jobName: string,
  data: T
): Promise<void> | undefined {
  switch (jobName) {
    case JobName.PRESENCE_JOIN:
      return addActiveMember(logger, redisClient, data);

    case JobName.PRESENCE_LEAVE:
      return removeActiveMember(logger, redisClient, data);

    case JobName.PRESENCE_UPDATE:
      return updateActiveMember(logger, redisClient, data);
  }
}

export default { route };
