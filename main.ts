import { addFeed, getCachedFeeds, getRedisClient } from './redis.ts';
import { getRssFeed, getRssUrl } from './feed.ts';

import { FeedNotFoundError } from './errors/feed-not-found-error.ts';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { MissingQueryParameterError } from './errors/missing-query-parameter-error.ts';

async function handler(request: Request): Promise<Response> {
  try {
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
    }
  }

  console.log(`Exiting function.`);
  return new Response(null, { status: 204 });
}

Deno.serve(handler);

// try {
//   // Check that feed exists
//   const url = getRssUrl(
//     'www.test.com?feedUrl=https://thedolentcity.substack.com/feed'
//   );
//   const feed = await getRssFeed(url);

//   // Save results
//   const redis = getRedisClient();
//   const cache = (await redis.get('feeds')) as CachedFeeds | null;
//   const feeds = cache ?? new Map();
//   const timestamp = Date.now();
//   feeds.set(url, timestamp);
//   await redis.set('feeds', feeds);
// } catch (error) {
//   if (error instanceof MissingQueryParameterError) {
//     console.log(error.message);
//   } else if (error instanceof FeedNotFoundError) {
//     console.log(error.message);
//   } else if (error instanceof MissingEnvironmentVariableError) {
//     console.error(error.message);
//   } else {
//     console.error(error.message);
//   }
// }

// console.log(`Exiting function.`);
