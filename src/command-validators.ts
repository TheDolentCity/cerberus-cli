import { AddFeedCommand, RemoveFeedCommand } from './commands.ts';

import { Flags } from './types.ts';
import { MissingFieldError } from '../errors/missing-field-error.ts';

export function addFeedCommandValidator(flags: Flags): AddFeedCommand {
  if (!flags?.feed) {
    throw new MissingFieldError('feed');
  }

  return {
    feedUrl: flags?.feed,
  };
}

export function removeFeedCommandValidator(flags: Flags): RemoveFeedCommand {
  if (!flags?.feed) {
    throw new MissingFieldError('feed');
  }

  return {
    feedUrl: flags?.feed,
  };
}
