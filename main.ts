import { addFeed, getCachedFeeds, getRedisClient } from './redis.ts';
import { getRssFeed, getRssUrl } from './feed.ts';

import { FeedNotFoundError } from './errors/feed-not-found-error.ts';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { MissingQueryParameterError } from './errors/missing-query-parameter-error.ts';

async function handler(request: Request): Promise<Response> {
  try {
    console.log(`Executing upload feed function...`);
    // Check that feed exists
    const url = getRssUrl(request.url);
    const feed = await getRssFeed(url);

    // Cache new feed in redis
    const redis = await getRedisClient();
    const feeds = await getCachedFeeds(redis);
    await addFeed(redis, feeds, url);
  } catch (error) {
    if (error instanceof MissingQueryParameterError) {
      console.log(error.message);
      return new Response(null, {
        status: 400,
        statusText: error.message,
      });
    } else if (error instanceof FeedNotFoundError) {
      console.log(error.message);
      return new Response(null, {
        status: 400,
        statusText: error.message,
      });
    } else if (error instanceof MissingEnvironmentVariableError) {
      console.error(error.message);
      return new Response(null, {
        status: 500,
        statusText: error.message,
      });
    } else {
      console.error(error.message);
      return new Response(null, {
        status: 500,
        statusText: error.message,
      });
    }
  }

  console.log(`Executed upload feed function.`);
  return new Response(null, { status: 204 });
}

Deno.serve(handler);

// Test API
// http://localhost:8000/?feedUrl=https%3A%2F%2Fthedolentcity.substack.com%2Ffeed
