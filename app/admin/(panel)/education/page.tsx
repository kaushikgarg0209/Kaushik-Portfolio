"use client";

import { useState } from "react";

import { CrudManager } from "@/components/admin/CrudManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Education } from "@/lib/db/schema";

function formatDateInput(value: string | null | undefined) {
  if (!value) return "";
  return value.slice(0, 10);
}

function EducationForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Education | null;
  onSave: (data: Partial<Education>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [institution, setInstitution] = useState(item?.institution ?? "");
  const [degree, setDegree] = useState(item?.degree ?? "");
  const [field, setField] = useState(item?.field ?? "");
  const [startDate, setStartDate] = useState(formatDateInput(item?.startDate));
  const [endDate, setEndDate] = useState(formatDateInput(item?.endDate));
  const [grade, setGrade] = useState(item?.grade ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          institution,
          degree,
          field,
          startDate,
          endDate: endDate.trim() || null,
          grade: grade || undefined,
          description: description || undefined,
          sortOrder,
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Institution</Label>
          <Input value={institution} onChange={(e) => setInstitution(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Degree</Label>
          <Input value={degree} onChange={(e) => setDegree(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Field of Study</Label>
          <Input value={field} onChange={(e) => setField(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Grade</Label>
          <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="8.5 CGPA" />
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminEducationPage() {
  return (
    <CrudManager<Education>
      title="Education"
      description="Manage your education history"
      apiPath="/api/admin/education"
      emptyLabel="No education entries yet."
      getItemTitle={(item) => item.degree}
      getItemSubtitle={(item) => item.institution}
      renderForm={(item, onSave, onCancel, saving) => (
        <EducationForm item={item} onSave={onSave} onCancel={onCancel} saving={saving} />
      )}
    />
  );
}
