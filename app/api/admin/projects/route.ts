import { asc, eq } from "drizzle-orm";

import { requireAdminSession, jsonError, jsonSuccess } from "@/lib/api-auth";
import { validationErrorResponse } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { revalidatePortfolio } from "@/lib/revalidate";
import { slugify } from "@/lib/utils";
import { projectSchema } from "@/lib/validations";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const data = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  return jsonSuccess(data);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse({
      ...body,
      slug: body.slug || slugify(body.title ?? ""),
    });
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [created] = await db.insert(projects).values(parsed.data).returning();
    revalidatePortfolio();
    return jsonSuccess(created, 201);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to create project", 500);
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return jsonError("ID is required");

    const parsed = projectSchema.safeParse(rest);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [updated] = await db
      .update(projects)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    revalidatePortfolio();
    return jsonSuccess(updated);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to update project", 500);
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("ID is required");

  await db.delete(projects).where(eq(projects.id, id));
  revalidatePortfolio();
  return jsonSuccess({ success: true });
}
