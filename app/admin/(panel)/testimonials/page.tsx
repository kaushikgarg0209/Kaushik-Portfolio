"use client";

import { useState } from "react";

import { CrudManager } from "@/components/admin/CrudManager";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Testimonial } from "@/lib/db/schema";

function TestimonialForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Testimonial | null;
  onSave: (data: Partial<Testimonial>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [role, setRole] = useState(item?.role ?? "");
  const [company, setCompany] = useState(item?.company ?? "");
  const [content, setContent] = useState(item?.content ?? "");
  const [avatarUrl, setAvatarUrl] = useState(item?.avatarUrl ?? "");
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          name,
          role,
          company,
          content,
          avatarUrl: avatarUrl || undefined,
          featured,
          sortOrder,
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Quote</Label>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={4} />
      </div>
      <div className="space-y-2">
        <Label>Avatar</Label>
        <ImageUpload value={avatarUrl} onChange={setAvatarUrl} folder="testimonials" />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={featured} onCheckedChange={setFeatured} />
        <Label>Featured</Label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminTestimonialsPage() {
  return (
    <CrudManager<Testimonial>
      title="Testimonials"
      description="Manage client and colleague testimonials"
      apiPath="/api/admin/testimonials"
      emptyLabel="No testimonials yet."
      getItemTitle={(item) => item.name}
      getItemSubtitle={(item) => `${item.role} at ${item.company}`}
      renderForm={(item, onSave, onCancel, saving) => (
        <TestimonialForm item={item} onSave={onSave} onCancel={onCancel} saving={saving} />
      )}
    />
  );
}
