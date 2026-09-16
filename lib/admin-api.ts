export class AdminApiError extends Error {
  details: { field: string; message: string }[];
  status: number;

  constructor(
    message: string,
    details: { field: string; message: string }[] = [],
    status = 400,
  ) {
    super(message);
    this.name = "AdminApiError";
    this.details = details;
    this.status = status;
  }
}

export type AdminFetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details: { field: string; message: string }[] };

export async function adminFetch<T = unknown>(
  url: string,
  options?: RequestInit,
): Promise<AdminFetchResult<T>> {
  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        error:
          typeof data.error === "string"
            ? data.error
            : `Request failed (${res.status})`,
        details: Array.isArray(data.details) ? data.details : [],
      };
    }

    return { ok: true, data: data as T };
  } catch {
    return {
      ok: false,
      error: "Network error — check your connection and try again",
      details: [],
    };
  }
}

export function showAdminError(
  result: { ok: false; error: string; details: { field: string; message: string }[] },
  toast: { error: (msg: string) => void },
) {
  toast.error(result.error);
  result.details.slice(0, 3).forEach((detail) => {
    toast.error(`${detail.field}: ${detail.message}`);
  });
}
