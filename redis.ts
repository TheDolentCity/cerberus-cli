import { consoleLog, consoleNewLine, consoleSeparator } from './console.ts';

import { CachedFeeds } from './types.ts';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { Redis } from 'npm:@upstash/redis@1.24.1';
import { load } from 'https://deno.land/std@0.204.0/dotenv/mod.ts';

function logFeed(feed: [string, number | undefined]) {
  if (feed && feed.length === 2) {
    console.log(
      `%c@ %c${feed[0]} %c> %c${feed[1]}`,
      'color: yellow',
      'color: white',
      'color: yellow',
      'color: white'
    );
  }
}

function logFeeds(feeds: CachedFeeds) {
  consoleNewLine();
  consoleSeparator();
  Array.from(feeds)?.forEach((feed) => {
    logFeed(feed);
  });
  consoleSeparator();
  consoleNewLine();
}

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

export async function getCachedFeeds(redis: Redis): Promise<CachedFeeds> {
  consoleLog('Retrieving cached feeds......');
  const json: object | null = await redis.get('feeds');
  const feeds: CachedFeeds = json ? new Map(Object.entries(json)) : new Map();
  console.log(
    `%c? %cRetrieved %c${feeds?.size ?? 0} %ccached feeds`,
    'color: blue',
    'color: white',
    'color: yellow',
    'color: white'
  );
  logFeeds(feeds);
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
  consoleLog('Updating cached feeds......');
  // await redis.set('feeds', map);
  consoleLog('Updated cached feeds');
}
