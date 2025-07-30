require('dotenv').config();
const Redis = require('ioredis');
import { createLogger } from "../utils/logger";

const logger = createLogger('redisClient')

type RedisKey = 'customers' | 'invoices';

let redis: typeof Redis | null = null;

export function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.UPSTASH_REDIS_URL!, {
      maxRetriesPerRequest: null,
    });

    if (process.env.NODE_ENV !== 'test') {
      redis.on('connect', () => {
        console.log('Successfully connected to Upstash Redis!');
      });

      redis.on('error', (err: Error) => {
        console.error('❌ Redis error:', err);
      });
    }
  }
  return redis;
};

function getRedisKey(redisKeyType: RedisKey, analysis: string, filter?: string) {
  let redisKey = null;
  switch (redisKeyType) {
    case 'customers': {
      redisKey = `customerAnalytics:${analysis}-${filter}`;
    }
    case 'invoices': {
      redisKey = `invoiceAnalytics:${analysis}`;
    }
  };
  return redisKey;
};

export async function cacheValue(redisKeyType: RedisKey, analysis: string, value: string, filter?: string) {
  try {
    const key = getRedisKey(redisKeyType, analysis, filter);

    await getRedis().set(key, value);
  } catch (error) {
    logger.error(`[cacheValue]: Error caching value into redis. ${error}.`);
  };
};