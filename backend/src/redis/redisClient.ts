import Redis from 'ioredis';

const redis = new Redis(process.env.UPSTASH_REDIS_URL!, {
  tls: {}  // Enables TLS for rediss://
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redis;