export const Commands: Readonly<{
  ADD_FEED: string;
  REMOVE_FEED: string;
}> = {
  ADD_FEED: 'addFeed',
  REMOVE_FEED: 'removeFeed',
};

export interface Flags {
  feed?: string | undefined;
}
