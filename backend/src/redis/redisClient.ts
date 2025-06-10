require('dotenv').config();
const Redis = require('ioredis');

export const redis = new Redis(process.env.UPSTASH_REDIS_URL!, {
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  console.log('Successfully connected to Upstash Redis!');
});

redis.on('error', (err: Error) => {
  console.error('❌ Redis error:', err);
});
