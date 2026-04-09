/**
 * Shared helpers for classifying MongoDB/Mongoose errors so API routes
 * can degrade gracefully (return empty data + warning) instead of 500
 * when the database is momentarily unreachable or misconfigured.
 */

const UNAVAILABLE_NAME_PATTERNS = [
  'MongoServerSelectionError',
  'MongoNetworkError',
  'MongoNetworkTimeoutError',
  'MongoTopologyClosedError',
  'MongoPoolClosedError',
  'MongoNotConnectedError',
  'MongoParseError',
  'MongooseServerSelectionError',
  'MongooseError',
];

const UNAVAILABLE_MESSAGE_PATTERNS = [
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'getaddrinfo',
  'buffering timed out',
  'ServerSelectionError',
  'connection <monitor>',
  'Client network socket disconnected',
  'failed to connect',
  'topology was destroyed',
  'pool was closed',
  'not connected',
  'Please define the MONGODB_URI',
];

export function isDbUnavailableError(error: unknown): boolean {
  if (!error) return false;

  const name = error instanceof Error ? error.name : '';
  if (UNAVAILABLE_NAME_PATTERNS.some((p) => name.includes(p))) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  if (UNAVAILABLE_MESSAGE_PATTERNS.some((p) => message.includes(p))) {
    return true;
  }

  // Mongoose wraps driver errors in `cause`
  const cause = (error as { cause?: unknown })?.cause;
  if (cause && cause !== error) {
    return isDbUnavailableError(cause);
  }

  return false;
}

export function describeError(error: unknown): { name: string; message: string } {
  if (error instanceof Error) {
    return { name: error.name || 'Error', message: error.message };
  }
  return { name: 'UnknownError', message: String(error) };
}

export function emptyListingsResponse(limit = 12, warning = 'Database is unavailable. Showing empty results.') {
  return {
    success: true,
    data: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit,
    },
    warning,
  };
}
