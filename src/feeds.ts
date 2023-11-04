import { FeedData, extract } from 'npm:@extractus/feed-extractor';
import { consoleLog, consoleNewLine, consoleSeparator } from './console.ts';

import { FeedNotFoundError } from '../errors/feed-not-found-error.ts';

function consoleLogFeed(feed: FeedData) {
  consoleNewLine();
  consoleSeparator();
  console.log(feed);
  consoleSeparator();
  consoleNewLine();
}

export async function getRssFeed(feedUrl: string): Promise<FeedData> {
  consoleLog('Retrieving RSS feed......');
  const feed = await extract(feedUrl, {
    xmlParserOptions: {
      ignoreAttributes: false,
      unpairedTags: ['hr', 'br', 'meta'],
      stopNodes: ['*.pre', '*.script'],
      processEntities: true,
      htmlEntities: true,
    },
  });

  if (!feed) {
    throw new FeedNotFoundError(feedUrl);
  }

  consoleLog('Retrieved RSS feed');
  consoleLogFeed(feed);
  return feed;
}
