import { desc, eq } from "drizzle-orm";

import { runAdminQuery } from "@/lib/admin-db";
import { requireAdminSession, jsonError, jsonSuccess } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const result = await runAdminQuery("contactMessages", () =>
    db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt)),
  );
  if (result.error) return result.error;
  return jsonSuccess(result.data);
}

export async function PATCH(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id, read } = await request.json();
    if (!id) return jsonError("ID is required");

    const [updated] = await db
      .update(contactMessages)
      .set({ read: !!read })
      .where(eq(contactMessages.id, id))
      .returning();

    return jsonSuccess(updated);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to update message", 500);
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("ID is required");

  const result = await runAdminQuery("contactMessages.delete", () =>
    db.delete(contactMessages).where(eq(contactMessages.id, id)),
  );
  if (result.error) return result.error;
  return jsonSuccess({ success: true });
}
