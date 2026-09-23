export class DbQueryError extends Error {
  readonly label: string;
  readonly cause: unknown;

  constructor(label: string, cause: unknown) {
    const message =
      cause instanceof Error ? cause.message : "Database query failed";
    super(`[${label}] ${message}`);
    this.name = "DbQueryError";
    this.label = label;
    this.cause = cause;
  }
}

function isRetriableDbError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const err = error as { code?: string; message?: string; cause?: unknown };
  const code = err.code ?? "";
  const message = String(err.message ?? "").toLowerCase();

  if (code === "ETIMEDOUT" || code === "ECONNRESET" || code === "ECONNREFUSED") {
    return true;
  }

  if (message.includes("timeout") || message.includes("connection")) {
    return true;
  }

  if (err.cause) {
    return isRetriableDbError(err.cause);
  }

  return false;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface QueryWithRetryOptions {
  attempts?: number;
  delayMs?: number;
  label?: string;
}

export async function queryWithRetry<T>(
  fn: () => Promise<T>,
  options: QueryWithRetryOptions = {},
): Promise<T> {
  const { attempts = 3, delayMs = 300, label = "query" } = options;

  if (!process.env.POSTGRES_URL) {
    throw new DbQueryError(label, new Error("POSTGRES_URL is not configured"));
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const retriable = isRetriableDbError(error);
      console.error(
        `Database query failed (${label}, attempt ${attempt}/${attempts}):`,
        error,
      );

      if (!retriable || attempt === attempts) {
        break;
      }

      await delay(delayMs * attempt);
    }
  }

  throw new DbQueryError(label, lastError);
}

export function isDbQueryError(error: unknown): error is DbQueryError {
  return error instanceof DbQueryError;
}
