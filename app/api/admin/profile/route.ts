import { eq } from "drizzle-orm";

import { runAdminQuery } from "@/lib/admin-db";
import { requireAdminSession, jsonError, jsonSuccess } from "@/lib/api-auth";
import { parseBody, serverErrorResponse, validationErrorResponse } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { revalidatePortfolio } from "@/lib/revalidate";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const result = await runAdminQuery("profile", async () => {
    const [data] = await db.select().from(profile).limit(1);
    return data ?? null;
  });
  if (result.error) return result.error;
  return jsonSuccess(result.data);
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const result = await parseBody(request, profileSchema);
    if ("error" in result) return result.error;

    const [existing] = await db.select().from(profile).limit(1);

    if (existing) {
      const [updated] = await db
        .update(profile)
        .set({ ...result.data, updatedAt: new Date() })
        .where(eq(profile.id, existing.id))
        .returning();
      revalidatePortfolio();
      return jsonSuccess({ success: true, data: updated, message: "Profile saved" });
    }

    const [created] = await db
      .insert(profile)
      .values(result.data)
      .returning();
    revalidatePortfolio();
    return jsonSuccess({ success: true, data: created, message: "Profile created" });
  } catch (err) {
    return serverErrorResponse("Could not save profile — please try again", err);
  }
}
