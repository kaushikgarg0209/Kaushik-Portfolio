"use client";

import { useState } from "react";

import { CrudManager } from "@/components/admin/CrudManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Skill } from "@/lib/db/schema";

function SkillForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Skill | null;
  onSave: (data: Partial<Skill>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState(item?.category ?? "General");
  const [proficiency, setProficiency] = useState(item?.proficiency ?? 3);
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, category, proficiency, sortOrder });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Proficiency (1-5)</Label>
          <Input
            type="number"
            min={1}
            max={5}
            value={proficiency}
            onChange={(e) => setProficiency(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AdminSkillsPage() {
  return (
    <CrudManager<Skill>
      title="Skills"
      description="Manage your technical skills"
      apiPath="/api/admin/skills"
      emptyLabel="No skills yet. Add your first skill!"
      getItemTitle={(item) => item.name}
      getItemSubtitle={(item) => `${item.category} · ${item.proficiency}/5`}
      renderForm={(item, onSave, onCancel, saving) => (
        <SkillForm item={item} onSave={onSave} onCancel={onCancel} saving={saving} />
      )}
    />
  );
}
