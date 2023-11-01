import { addFeed, getRedisClient } from './redis.ts';
import { consoleError, consoleHeader, consoleSeparator } from './console.ts';

import { FeedNotFoundError } from './errors/feed-not-found-error.ts';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { getRssFeed } from './feed.ts';
import { parse } from 'https://deno.land/std@0.202.0/flags/mod.ts';

async function addFeedCommand(url: string): Promise<void> {
  // Check that feed exists
  const feed = await getRssFeed(url);

  // Cache new feed in redis
  const redis = await getRedisClient();
  await addFeed(redis, url);
}

async function main(): Promise<void> {
  try {
    consoleHeader('Welcome to Cerberus CLI');
    consoleSeparator();

    // Parse CLI Arguments and Flags
    const command = Deno.args[0];
    const flags = parse(Deno.args, {
      string: ['feed'],
    });

    // Process commands
    if (command === 'addFeed' && flags?.feed) {
      await addFeedCommand(flags?.feed);
    }
    // Default handling of unknown commands
    else {
      console.log(`Unknown command '${command}'`);
    }

    consoleSeparator();
  } catch (error) {
    if (error instanceof FeedNotFoundError) {
      consoleError(error.message);
    } else if (error instanceof MissingEnvironmentVariableError) {
      consoleError(error.message);
    } else {
      consoleError(error.message);
    }
  }
}

main();
