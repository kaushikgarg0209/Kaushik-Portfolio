import { asc, eq } from "drizzle-orm";

import { runAdminQuery } from "@/lib/admin-db";
import { requireAdminSession, jsonError, jsonSuccess } from "@/lib/api-auth";
import { validationErrorResponse } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { experience } from "@/lib/db/schema";
import { revalidatePortfolio } from "@/lib/revalidate";
import { experienceSchema } from "@/lib/validations";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const result = await runAdminQuery("experience", () =>
    db.select().from(experience).orderBy(asc(experience.sortOrder)),
  );
  if (result.error) return result.error;
  return jsonSuccess(result.data);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = experienceSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [created] = await db
      .insert(experience)
      .values({ ...parsed.data, endDate: parsed.data.endDate ?? null })
      .returning();
    revalidatePortfolio();
    return jsonSuccess(created, 201);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to create experience", 500);
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return jsonError("ID is required");

    const parsed = experienceSchema.safeParse(rest);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [updated] = await db
      .update(experience)
      .set({
        ...parsed.data,
        endDate: parsed.data.endDate ?? null,
        updatedAt: new Date(),
      })
      .where(eq(experience.id, id))
      .returning();

    revalidatePortfolio();
    return jsonSuccess(updated);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to update experience", 500);
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("ID is required");

  const result = await runAdminQuery("experience.delete", () =>
    db.delete(experience).where(eq(experience.id, id)),
  );
  if (result.error) return result.error;
  revalidatePortfolio();
  return jsonSuccess({ success: true });
}
