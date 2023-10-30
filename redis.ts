import { CachedFeeds } from './types.ts';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { Redis } from 'npm:@upstash/redis@1.24.1';
import { load } from 'https://deno.land/std@0.204.0/dotenv/mod.ts';

// import { Redis } from 'https://deno.land/x/upstash_redis@v1.14.0/mod.ts';

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
  const json: object | null = await redis.get('feeds');
  console.log('Retrieved cached feeds.');
  console.log(json);
  const feeds: CachedFeeds = json ? new Map(Object.entries(json)) : new Map();
  console.log(feeds);
  return feeds;
}

export async function addFeed(
  redis: Redis,
  feeds: CachedFeeds,
  feedUrl: string
) {
  // Add feed to map with latest timestamp for value
  const timestamp = Date.now();
  feeds.set(feedUrl, timestamp);

  // Serialize the map
  const map = Object.fromEntries(feeds);
  // const serialized = JSON.stringify(map);
  console.log('Updating cached feeds...');
  await redis.set('feeds', map);
  console.log('Updated cached feeds.');
}
