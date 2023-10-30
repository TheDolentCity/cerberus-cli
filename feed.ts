import { FeedData, FeedEntry, extract } from 'npm:@extractus/feed-extractor';

import { FeedNotFoundError } from './errors/feed-not-found-error.ts';
import { MissingQueryParameterError } from './errors/missing-query-parameter-error.ts';

export function getRssUrl(requestUrl: string): string {
  const params = new URL(requestUrl).searchParams;
  const feedUrl = params.get('feedUrl');
  if (!feedUrl) {
    throw new MissingQueryParameterError('feedUrl');
  }

  return feedUrl;
}

export async function getRssFeed(feedUrl: string): Promise<FeedData> {
  console.log('Retrieving RSS feed...');
  const feed = await extract(feedUrl);

  if (!feed) {
    throw new FeedNotFoundError(feedUrl);
  }

  console.log('Retrieved RSS feed.');
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
