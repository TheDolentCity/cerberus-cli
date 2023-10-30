import { CachedFeeds } from './types.ts';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { Redis } from 'https://deno.land/x/upstash_redis@v1.14.0/mod.ts';
import { load } from 'https://deno.land/std@0.204.0/dotenv/mod.ts';

export async function getRedisClient(): Promise<Redis> {
  console.log(`Connecting to Redis...`);

  // Get Redis environment variables
  const env = await load();
  const redisUrl = env['UPSTASH_REDIS_REST_URL'];
  const redisToken = env['UPSTASH_REDIS_REST_TOKEN'];

  // Error if missing environment variables
  if (!redisUrl) {
    console.log(redisUrl);
    throw new MissingEnvironmentVariableError('UPSTASH_REDIS_REST_URL');
  }
  if (!redisToken) {
    console.log(redisToken);
    throw new MissingEnvironmentVariableError('UPSTASH_REDIS_REST_TOKEN');
  }

  // Initialize Redis Connection
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  // Return Redis client
  console.log(`Redis connection established.`);
  return redis;
}

export async function getCachedFeeds(redis: Redis): Promise<CachedFeeds> {
  console.log('Fetching cached feeds...');
  const cache = (await redis.get('feeds')) as CachedFeeds | null;
  console.log(cache);
  console.log('Retrieved cached feeds.');
  const feeds = cache ?? new Map();
  console.log(feeds);
  return feeds;
}

export async function addFeed(
  redis: Redis,
  feeds: CachedFeeds,
  feedUrl: string
) {
  const timestamp = Date.now();
  feeds.set(feedUrl, timestamp);
  console.log('Updating cached feeds...');
  console.log(feeds);
  await redis.set('feeds', feeds);
  console.log('Updated cached feeds.');
}
