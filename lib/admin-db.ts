import { jsonError } from "@/lib/api-auth";
import { isDbQueryError, queryWithRetry } from "@/lib/db/query-utils";

export async function runAdminQuery<T>(label: string, fn: () => Promise<T>) {
  try {
    const data = await queryWithRetry(fn, { label });
    return { data, error: null as null };
  } catch (err) {
    console.error(err);
    if (isDbQueryError(err)) {
      return {
        data: null,
        error: jsonError(
          "Database temporarily unavailable — please retry",
          503,
        ),
      };
    }
    return { data: null, error: jsonError("Database error", 500) };
  }
}
