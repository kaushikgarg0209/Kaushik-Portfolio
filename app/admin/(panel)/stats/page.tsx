"use client";

import { useState } from "react";

import { CrudManager } from "@/components/admin/CrudManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Stat } from "@/lib/db/schema";

function StatForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Stat | null;
  onSave: (data: Partial<Stat>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [label, setLabel] = useState(item?.label ?? "");
  const [value, setValue] = useState(item?.value ?? 0);
  const [suffix, setSuffix] = useState(item?.suffix ?? "");
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ label, value, suffix: suffix || undefined, sortOrder });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Value</Label>
          <Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} required />
        </div>
        <div className="space-y-2">
          <Label>Suffix (e.g. +)</Label>
          <Input value={suffix} onChange={(e) => setSuffix(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminStatsPage() {
  return (
    <CrudManager<Stat>
      title="Stats"
      description="Manage homepage stat counters"
      apiPath="/api/admin/stats"
      emptyLabel="No stats yet."
      getItemTitle={(item) => item.label}
      getItemSubtitle={(item) => `${item.value}${item.suffix ?? ""}`}
      renderForm={(item, onSave, onCancel, saving) => (
        <StatForm item={item} onSave={onSave} onCancel={onCancel} saving={saving} />
      )}
    />
  );
}
