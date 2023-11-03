import { Commands, Flags } from './src/types.ts';
import {
  addFeedCommandHandler,
  removeFeedCommandHandler,
} from './src/command-handlers.ts';
import {
  addFeedCommandValidator,
  removeFeedCommandValidator,
} from './src/command-validators.ts';
import { consoleError, consoleHeader, consoleSeparator } from './console.ts';

import { FeedNotFoundError } from './errors/feed-not-found-error.ts';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { MissingFieldError } from './errors/missing-field-error.ts';
import { parse } from 'https://deno.land/std@0.202.0/flags/mod.ts';

function getCommand() {
  return Deno.args[0];
}

function getFlags(): Flags {
  return parse(Deno.args, {
    string: ['feed'],
  }) as Flags;
}

async function process(command: string, flags: Flags) {
  switch (command) {
    case Commands.ADD_FEED:
      {
        const command = addFeedCommandValidator(flags);
        await addFeedCommandHandler(command);
      }
      break;
    case Commands.REMOVE_FEED:
      {
        const command = removeFeedCommandValidator(flags);
        await removeFeedCommandHandler(command);
      }
      break;
    default:
      console.error(`Unknown command '${command}'`);
      break;
  }
}

async function cli() {
  consoleHeader('Welcome to Cerberus CLI');
  consoleSeparator();

  // Parse CLI command and flags
  const command = getCommand();
  const flags = getFlags();

  // Process command
  await process(command, flags);

  consoleSeparator();
}

async function main() {
  try {
    await cli();
  } catch (error) {
    if (error instanceof FeedNotFoundError) {
      consoleError(error.message);
    } else if (error instanceof MissingEnvironmentVariableError) {
      consoleError(error.message);
    } else if (error instanceof MissingFieldError) {
      consoleError(error.message);
    } else {
      consoleError(error.message);
    }
  }
}

main();
