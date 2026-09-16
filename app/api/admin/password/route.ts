import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";

import { requireAdminSession, jsonError, jsonSuccess } from "@/lib/api-auth";
import { validationErrorResponse } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { passwordChangeSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = passwordChangeSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, session!.user!.id))
      .limit(1);

    if (!user) return jsonError("User not found", 404);

    const isValid = await compare(parsed.data.currentPassword, user.passwordHash);
    if (!isValid) return jsonError("Current password is incorrect");

    const passwordHash = await hash(parsed.data.newPassword, 12);
    await db
      .update(adminUsers)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(adminUsers.id, user.id));

    return jsonSuccess({ success: true });
  } catch (err) {
    console.error(err);
    return jsonError("Failed to change password", 500);
  }
}
