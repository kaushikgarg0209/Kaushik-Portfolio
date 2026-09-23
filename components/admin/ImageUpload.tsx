"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  /** Called after a successful upload with the new URL. */
  onUploadComplete?: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  inputId?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onUploadComplete,
  folder = "uploads",
  accept = "image/*",
  label = "Upload image",
  inputId = "image-upload-input",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onChange(data.url);
      onUploadComplete?.(data.url);
    } catch {
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative inline-block">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0f]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Upload preview"
              className="h-full w-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={() => onChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 transition-colors hover:border-cyan-500/40 hover:bg-white/10"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          ) : (
            <>
              <ImagePlus className="mb-2 h-8 w-8 text-slate-400" />
              <span className="text-sm text-slate-400">{label}</span>
            </>
          )}
        </button>
      )}
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        aria-label={label}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
    </div>
  );
}
