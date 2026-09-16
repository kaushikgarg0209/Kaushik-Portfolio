import { NextResponse } from "next/server";
import type { ZodError, ZodType } from "zod";

export function formatZodError(error: ZodError): {
  message: string;
  details: { field: string; message: string }[];
} {
  const details = error.issues.map((issue) => ({
    field: issue.path.join(".") || "form",
    message: issue.message,
  }));

  const message =
    details.length === 1
      ? details[0].message
      : `Please fix ${details.length} fields: ${details.map((d) => d.field).join(", ")}`;

  return { message, details };
}

export function validationErrorResponse(error: ZodError, status = 400) {
  const formatted = formatZodError(error);
  return NextResponse.json(
    {
      error: formatted.message,
      details: formatted.details,
      success: false,
    },
    { status },
  );
}

export async function parseBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return { error: validationErrorResponse(parsed.error) };
    }
    return { data: parsed.data };
  } catch {
    return {
      error: NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details: [],
          success: false,
        },
        { status: 400 },
      ),
    };
  }
}

export function serverErrorResponse(message: string, err?: unknown) {
  console.error(message, err);
  return NextResponse.json(
    {
      error: message,
      details: [],
      success: false,
    },
    { status: 500 },
  );
}
