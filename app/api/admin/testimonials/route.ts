import { asc, eq } from "drizzle-orm";

import { runAdminQuery } from "@/lib/admin-db";
import { requireAdminSession, jsonError, jsonSuccess } from "@/lib/api-auth";
import { validationErrorResponse } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { revalidatePortfolio } from "@/lib/revalidate";
import { testimonialSchema } from "@/lib/validations";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const result = await runAdminQuery("testimonials", () =>
    db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)),
  );
  if (result.error) return result.error;
  return jsonSuccess(result.data);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [created] = await db
      .insert(testimonials)
      .values(parsed.data)
      .returning();
    revalidatePortfolio();
    return jsonSuccess(created, 201);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to create testimonial", 500);
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return jsonError("ID is required");

    const parsed = testimonialSchema.safeParse(rest);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [updated] = await db
      .update(testimonials)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();

    revalidatePortfolio();
    return jsonSuccess(updated);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to update testimonial", 500);
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("ID is required");

  const result = await runAdminQuery("testimonials.delete", () =>
    db.delete(testimonials).where(eq(testimonials.id, id)),
  );
  if (result.error) return result.error;
  revalidatePortfolio();
  return jsonSuccess({ success: true });
}
