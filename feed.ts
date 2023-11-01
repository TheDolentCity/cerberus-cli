import { FeedData, FeedEntry, extract } from 'npm:@extractus/feed-extractor';

import { FeedNotFoundError } from './errors/feed-not-found-error.ts';
import { consoleLog } from './console.ts';

export async function getRssFeed(feedUrl: string): Promise<FeedData> {
  consoleLog('Retrieving RSS feed......');
  const feed = await extract(feedUrl);

  if (!feed) {
    throw new FeedNotFoundError(feedUrl);
  }

  consoleLog('Retrieved RSS feed');
  return feed;
}

export function getLatestEntry(feed: FeedData): FeedEntry | undefined {
  let latest: FeedEntry | undefined;

  feed.entries?.forEach((entry) => {
    if (!latest) {
      latest = entry;
    } else if (
      entry?.published &&
      latest?.published &&
      latest.published < entry.published
    ) {
      latest = entry;
    }
  });

  console.log(`Latest entry: ${latest?.title ?? 'NULL'}`);
  console.log(latest);

  return latest;
}
