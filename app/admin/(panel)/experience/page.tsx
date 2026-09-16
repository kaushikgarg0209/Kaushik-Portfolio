"use client";

import { useState } from "react";

import { CrudManager } from "@/components/admin/CrudManager";
import { TagInput } from "@/components/admin/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Experience } from "@/lib/db/schema";

function ExperienceForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Experience | null;
  onSave: (data: Partial<Experience>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [company, setCompany] = useState(item?.company ?? "");
  const [role, setRole] = useState(item?.role ?? "");
  const [location, setLocation] = useState(item?.location ?? "Remote");
  const [employmentType, setEmploymentType] = useState(item?.employmentType ?? "full_time");
  const [startDate, setStartDate] = useState(item?.startDate ?? "");
  const [endDate, setEndDate] = useState(item?.endDate ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [achievements, setAchievements] = useState<string[]>(item?.achievements ?? []);
  const [techUsed, setTechUsed] = useState<string[]>(item?.techUsed ?? []);
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          company,
          role,
          location,
          employmentType,
          startDate,
          endDate: endDate || undefined,
          description,
          achievements,
          techUsed,
          sortOrder,
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Company</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Employment Type</Label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as Experience["employmentType"])}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            <option value="full_time">Full Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>End Date (leave empty if current)</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Achievements</Label>
        <TagInput value={achievements} onChange={setAchievements} placeholder="Add achievement bullet" />
      </div>
      <div className="space-y-2">
        <Label>Technologies Used</Label>
        <TagInput value={techUsed} onChange={setTechUsed} placeholder="Add technology" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminExperiencePage() {
  return (
    <CrudManager<Experience>
      title="Experience"
      description="Manage your work history"
      apiPath="/api/admin/experience"
      emptyLabel="No experience entries yet."
      getItemTitle={(item) => `${item.role} at ${item.company}`}
      getItemSubtitle={(item) => item.location}
      renderForm={(item, onSave, onCancel, saving) => (
        <ExperienceForm item={item} onSave={onSave} onCancel={onCancel} saving={saving} />
      )}
    />
  );
}
