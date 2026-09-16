"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminFetch, showAdminError } from "@/lib/admin-api";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { TagInput } from "@/components/admin/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile, SocialLink } from "@/lib/db/schema";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newLink, setNewLink] = useState({ label: "", url: "" });

  useEffect(() => {
    Promise.all([
      adminFetch<Profile>("/api/admin/profile"),
      adminFetch<SocialLink[]>("/api/admin/social-links"),
    ]).then(([profileResult, linksResult]) => {
      if (!profileResult.ok) {
        setLoadError(profileResult.error);
      } else {
        setProfile(profileResult.data ?? {});
      }
      if (linksResult.ok) {
        setSocialLinks(Array.isArray(linksResult.data) ? linksResult.data : []);
      }
      setLoading(false);
    });
  }, []);

  async function persistProfile(
    overrides: Partial<Profile> = {},
    successMessage: string,
  ) {
    const nextProfile = { ...profile, ...overrides };
    const payload = {
      ...nextProfile,
      typedRoles: (nextProfile.typedRoles as string[]) ?? [],
    };
    const result = await adminFetch<{ data?: Profile }>("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!result.ok) {
      showAdminError(result, toast);
      return false;
    }
    const saved = result.data?.data;
    if (saved) setProfile(saved);
    toast.success(successMessage);
    return true;
  }

  async function saveProfile() {
    setSaving(true);
    await persistProfile({}, "Profile saved — live site updated");
    setSaving(false);
  }

  async function handleProfileImageUpload(url: string) {
    setProfile((prev) => ({ ...prev, profileImageUrl: url }));
    setSaving(true);
    await persistProfile(
      { profileImageUrl: url },
      "Profile photo saved — live site updated",
    );
    setSaving(false);
  }

  async function addSocialLink() {
    if (!newLink.label || !newLink.url) {
      toast.error("Label and URL are required for social links");
      return;
    }
    const result = await adminFetch<SocialLink>("/api/admin/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newLink,
        platform: "other",
        sortOrder: socialLinks.length,
      }),
    });
    if (!result.ok) {
      showAdminError(result, toast);
      return;
    }
    setSocialLinks([...socialLinks, result.data]);
    setNewLink({ label: "", url: "" });
    toast.success("Social link added");
  }

  async function deleteLink(id: string) {
    const result = await adminFetch(`/api/admin/social-links?id=${id}`, {
      method: "DELETE",
    });
    if (!result.ok) {
      showAdminError(result, toast);
      return;
    }
    setSocialLinks(socialLinks.filter((l) => l.id !== id));
    toast.success("Social link removed");
  }

  if (loading) return <div className="text-slate-400">Loading profile...</div>;

  if (loadError) {
    return (
      <div>
        <AdminHeader title="Profile" description="Manage your hero and about information" />
        <p className="text-red-300">Could not load profile: {loadError}</p>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader title="Profile" description="Manage your hero and about information" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <ImageUpload
                value={profile.profileImageUrl ?? ""}
                onChange={(url) => setProfile({ ...profile, profileImageUrl: url })}
                onUploadComplete={handleProfileImageUpload}
                folder="profile"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={profile.fullName ?? ""}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Name</Label>
                <Input
                  value={profile.preferredName ?? ""}
                  onChange={(e) => setProfile({ ...profile, preferredName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={profile.title ?? ""}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={profile.tagline ?? ""}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Short Bio</Label>
              <Textarea
                value={profile.bioShort ?? ""}
                onChange={(e) => setProfile({ ...profile, bioShort: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Full Bio (Markdown)</Label>
              <Textarea
                value={profile.bio ?? ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact & Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={profile.email ?? ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={profile.phone ?? ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={profile.location ?? ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  value={profile.yearsOfExperience ?? 0}
                  onChange={(e) =>
                    setProfile({ ...profile, yearsOfExperience: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <select
                value={profile.availabilityStatus ?? "open_to_work"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    availabilityStatus: e.target.value as Profile["availabilityStatus"],
                  })
                }
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              >
                <option value="open_to_work">Open to Work</option>
                <option value="open_to_freelance">Open to Freelance</option>
                <option value="not_looking">Not Looking</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Availability Message</Label>
              <Input
                value={profile.availabilityMessage ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, availabilityMessage: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Typewriter Roles</Label>
              <TagInput
                value={(profile.typedRoles as string[]) ?? []}
                onChange={(roles) => setProfile({ ...profile, typedRoles: roles })}
                placeholder="Add role for typewriter"
              />
            </div>
            <div className="space-y-2">
              <Label>Resume PDF</Label>
              <ImageUpload
                value={profile.resumeUrl ?? ""}
                onChange={(url) => setProfile({ ...profile, resumeUrl: url })}
                folder="resume"
                accept="application/pdf,.pdf"
                label="Upload resume PDF"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialLinks.map((link) => (
            <div key={link.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
              <div>
                <p className="font-medium text-white">{link.label}</p>
                <p className="text-sm text-slate-400">{link.url}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteLink(link.id)}>
                Delete
              </Button>
            </div>
          ))}
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
            <Input
              placeholder="Label (shown on site, e.g. GitHub)"
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
            />
            <Input
              placeholder="URL"
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            />
            <Button onClick={addSocialLink} className="w-full sm:w-auto">
              Add Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button onClick={saveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
