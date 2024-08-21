import { Job, Worker } from 'bullmq';
import { getLogger } from '../util/logger.util';
import { route } from './router';
import { connectionOptionsIo, getRedisClient } from '../lib/redis';

const QUEUE_NAME = 'presence';

const logger = getLogger(QUEUE_NAME);
const redisClient = getRedisClient();

let worker: Worker | null = null;

async function initializeConnections(): Promise<void> {
  if (!redisClient) {
    throw new Error('Failed to initialize Redis client');
  }

  try {
    await redisClient.connect();
  } catch (err) {
    logger.error('Failed to connect to Redis', { err });
    throw err;
  }
}

async function handler({ id, name, data }: Job) {
  if (!redisClient) {
    throw new Error('Redis connections not initialized');
  }

  logger.info(`Processing job ${id} (${name})`, { data });

  await route(logger, redisClient, name, data);
}

export async function startWorker() {
  await initializeConnections();

  worker = new Worker(QUEUE_NAME, handler, {
    connection: connectionOptionsIo,
    prefix: 'queue'
  });

  worker.on('failed', (job: Job<any, void, string> | undefined, err: Error, prev: string) => {
    logger.error(`Failed to process job ${job?.id}`, { err });
  });

  worker.on('ready', () => {
    logger.info(`Presence worker ready`);
  });

  worker.on('active', () => {
    logger.info(`Presence worker active`);
  });
}

export async function stopWorker(): Promise<void> {
  if (!worker) {
    throw new Error('Worker not initialized');
  }

  try {
    await worker.close();
  } catch (err) {
    logger.error('Failed to close worker', { err });
  } finally {
    worker = null;
  }
}
