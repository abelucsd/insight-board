require('dotenv').config();
const Redis = require('ioredis');

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