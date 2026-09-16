import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { jsonError, jsonSuccess } from "@/lib/api-auth";
import { validationErrorResponse } from "@/lib/api-utils";
import { CONTACT_FIELD_LIMITS, contactSchema } from "@/lib/validations";

/** Reject oversized JSON bodies before parsing (abuse protection). */
const MAX_CONTACT_BODY_BYTES =
  Object.values(CONTACT_FIELD_LIMITS).reduce((sum, n) => sum + n, 0) + 512;

export async function POST(request: Request) {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_CONTACT_BODY_BYTES) {
      return jsonError("Request too large", 413);
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const [message] = await db
      .insert(contactMessages)
      .values(parsed.data)
      .returning();

    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: process.env.CONTACT_EMAIL,
            subject: parsed.data.subject || `New message from ${parsed.data.name}`,
            html: `
              <h2>New Contact Message</h2>
              <p><strong>Name:</strong> ${parsed.data.name}</p>
              <p><strong>Email:</strong> ${parsed.data.email}</p>
              <p><strong>Message:</strong></p>
              <p>${parsed.data.message}</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }

    return jsonSuccess({ success: true, id: message.id }, 201);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to send message", 500);
  }
}
