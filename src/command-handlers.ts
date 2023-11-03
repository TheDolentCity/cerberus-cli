import { AddFeedCommand, RemoveFeedCommand } from './commands.ts';
import { addFeed, getRedisClient, removeFeed } from './redis.ts';

import { getRssFeed } from './feeds.ts';

export async function addFeedCommandHandler(command: AddFeedCommand) {
  // Check that feed exists
  const feed = await getRssFeed(command.feedUrl);

  const redis = await getRedisClient();
  await addFeed(redis, command.feedUrl);
}

export async function removeFeedCommandHandler(command: RemoveFeedCommand) {
  const redis = await getRedisClient();
  await removeFeed(redis, command.feedUrl);
}
