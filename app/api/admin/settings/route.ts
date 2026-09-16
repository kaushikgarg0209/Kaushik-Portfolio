import { eq } from "drizzle-orm";

import { requireAdminSession, jsonSuccess } from "@/lib/api-auth";
import { parseBody, serverErrorResponse } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { normalizeSectionVisibility } from "@/lib/sections";
import { revalidatePortfolio } from "@/lib/revalidate";
import { siteSettingsSchema } from "@/lib/validations";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const [data] = await db.select().from(siteSettings).limit(1);
  if (!data) return jsonSuccess(null);

  return jsonSuccess({
    ...data,
    sectionVisibility: normalizeSectionVisibility(data.sectionVisibility),
  });
}

export async function PUT(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const result = await parseBody(request, siteSettingsSchema);
    if ("error" in result) return result.error;

    const payload = {
      ...result.data,
      sectionVisibility: normalizeSectionVisibility(result.data.sectionVisibility),
    };

    const [existing] = await db.select().from(siteSettings).limit(1);

    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ ...payload, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id))
        .returning();
      revalidatePortfolio();
      return jsonSuccess({
        success: true,
        data: updated,
        message: "Settings saved successfully",
      });
    }

    const [created] = await db
      .insert(siteSettings)
      .values(payload)
      .returning();
    revalidatePortfolio();
    return jsonSuccess({
      success: true,
      data: created,
      message: "Settings created successfully",
    });
  } catch (err) {
    return serverErrorResponse("Could not save settings — please try again", err);
  }
}
