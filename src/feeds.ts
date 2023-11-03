import { FeedData, extract } from 'npm:@extractus/feed-extractor';
import { consoleLog, consoleNewLine, consoleSeparator } from '../console.ts';

import { FeedNotFoundError } from '../errors/feed-not-found-error.ts';

function consoleLogFeed(feed: FeedData) {
  consoleNewLine();
  consoleSeparator();
  console.log(
    `%c@ %cTitle:       ${feed?.title ?? 'Unknown'}`,
    'color: yellow',
    'color: white'
  );
  if (feed?.description && typeof feed.description === 'string') {
    console.log(
      `%c@ %cDescription: ${feed.description.replaceAll('\n', ' ')}`,
      'color: yellow',
      'color: white'
    );
  }
  console.log(
    `%c@ %cDate:        ${new Date(feed?.published ?? 0)}`,
    'color: yellow',
    'color: white'
  );
  console.log(
    `%c@ %cLink:        ${feed?.link ?? 'Unknown'}`,
    'color: yellow',
    'color: white'
  );
  consoleSeparator();
  consoleNewLine();
}

export async function getRssFeed(feedUrl: string): Promise<FeedData> {
  consoleLog('Retrieving RSS feed......');
  const feed = await extract(feedUrl);

  if (!feed) {
    throw new FeedNotFoundError(feedUrl);
  }

  consoleLog('Retrieved RSS feed');
  consoleLogFeed(feed);
  return feed;
}