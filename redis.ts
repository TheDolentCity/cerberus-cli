import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { Redis } from 'npm:@upstash/redis@1.24.1';
import { consoleLog } from './console.ts';
import { load } from 'https://deno.land/std@0.204.0/dotenv/mod.ts';

export async function getRedisClient(): Promise<Redis> {
  consoleLog('Connecting to Redis......');

  // Get Redis environment variables
  const env = await load();
  const redisUrl = env['UPSTASH_REDIS_REST_URL'];
  const redisToken = env['UPSTASH_REDIS_REST_TOKEN'];

  // Error if missing environment variables
  if (!redisUrl) {
    throw new MissingEnvironmentVariableError('UPSTASH_REDIS_REST_URL');
  }
  if (!redisToken) {
    throw new MissingEnvironmentVariableError('UPSTASH_REDIS_REST_TOKEN');
  }

  // Initialize Redis Connection
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  // Return Redis client
  consoleLog('Connected to Redis');
  return redis;
}

export async function addFeed(redis: Redis, feed: string) {
  consoleLog('Updating cached feeds......');
  await redis.sadd('feeds', feed);
  consoleLog('Updated cached feeds');
}
