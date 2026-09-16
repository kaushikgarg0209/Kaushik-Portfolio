"use client";

import { useState } from "react";

import { CrudManager } from "@/components/admin/CrudManager";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Certification } from "@/lib/db/schema";

function CertificationForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Certification | null;
  onSave: (data: Partial<Certification>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [issuer, setIssuer] = useState(item?.issuer ?? "");
  const [issueDate, setIssueDate] = useState(item?.issueDate ?? "");
  const [expiryDate, setExpiryDate] = useState(item?.expiryDate ?? "");
  const [credentialId, setCredentialId] = useState(item?.credentialId ?? "");
  const [credentialUrl, setCredentialUrl] = useState(item?.credentialUrl ?? "");
  const [badgeImageUrl, setBadgeImageUrl] = useState(item?.badgeImageUrl ?? "");
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          name,
          issuer,
          issueDate,
          expiryDate: expiryDate || undefined,
          credentialId: credentialId || undefined,
          credentialUrl: credentialUrl || undefined,
          badgeImageUrl: badgeImageUrl || undefined,
          sortOrder,
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Certification Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Issuer</Label>
          <Input value={issuer} onChange={(e) => setIssuer(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Issue Date</Label>
          <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Credential ID</Label>
          <Input value={credentialId} onChange={(e) => setCredentialId(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Credential URL</Label>
          <Input value={credentialUrl} onChange={(e) => setCredentialUrl(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Badge Image</Label>
        <ImageUpload value={badgeImageUrl} onChange={setBadgeImageUrl} folder="certifications" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminCertificationsPage() {
  return (
    <CrudManager<Certification>
      title="Certifications"
      description="Manage your certifications"
      apiPath="/api/admin/certifications"
      emptyLabel="No certifications yet."
      getItemTitle={(item) => item.name}
      getItemSubtitle={(item) => item.issuer}
      renderForm={(item, onSave, onCancel, saving) => (
        <CertificationForm item={item} onSave={onSave} onCancel={onCancel} saving={saving} />
      )}
    />
  );
}
