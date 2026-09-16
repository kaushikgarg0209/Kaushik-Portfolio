import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

import { requireAdminSession, jsonError, jsonSuccess } from "@/lib/api-auth";

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) return jsonError("No file provided");

    const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, { access: "public" });
      return jsonSuccess({ url: blob.url });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, path.basename(filename));
    await writeFile(filePath, buffer);

    return jsonSuccess({ url: `/uploads/${folder}/${path.basename(filename)}` });
  } catch (err) {
    console.error("Upload error:", err);
    return jsonError("Upload failed", 500);
  }
}
