import { Job, Worker } from 'bullmq';
import { getLogger } from '../util/logger.util';
import { route } from './router';
import { connectionOptionsIo, getRedisClient } from '../lib/redis';

const QUEUE_NAME = 'presence';

const logger = getLogger(QUEUE_NAME);
const redisClient = getRedisClient();

async function handler({ name, data }: Job) {
  try {
    logger.info(`Processing ${name}`, { data });
    await route(logger, redisClient, name, data);
  } catch (err) {
    logger.error(`Processing job (${name}) failed`, { err, data });
    throw err;
  }
}

export async function startWorker() {
  await redisClient.connect();

  const worker = new Worker(QUEUE_NAME, handler, {
    connection: connectionOptionsIo,
    prefix: 'queue'
  });

  worker.on('failed', (job: Job<any, void, string> | undefined, err: Error, prev: string) => {
    logger.error(`Failed to process job ${job?.id}`, { err });
  });
}
