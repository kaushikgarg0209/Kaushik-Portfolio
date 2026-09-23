import { asc, eq } from "drizzle-orm";

import { runAdminQuery } from "@/lib/admin-db";
import { requireAdminSession, jsonError, jsonSuccess } from "@/lib/api-auth";
import { validationErrorResponse } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { certifications } from "@/lib/db/schema";
import { revalidatePortfolio } from "@/lib/revalidate";
import { certificationSchema } from "@/lib/validations";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const result = await runAdminQuery("certifications", () =>
    db.select().from(certifications).orderBy(asc(certifications.sortOrder)),
  );
  if (result.error) return result.error;
  return jsonSuccess(result.data);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = certificationSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [created] = await db
      .insert(certifications)
      .values(parsed.data)
      .returning();
    revalidatePortfolio();
    return jsonSuccess(created, 201);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to create certification", 500);
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return jsonError("ID is required");

    const parsed = certificationSchema.safeParse(rest);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [updated] = await db
      .update(certifications)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(certifications.id, id))
      .returning();

    revalidatePortfolio();
    return jsonSuccess(updated);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to update certification", 500);
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("ID is required");

  const result = await runAdminQuery("certifications.delete", () =>
    db.delete(certifications).where(eq(certifications.id, id)),
  );
  if (result.error) return result.error;
  revalidatePortfolio();
  return jsonSuccess({ success: true });
}
