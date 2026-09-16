"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminFetch, showAdminError } from "@/lib/admin-api";
import {
  DEFAULT_SECTION_VISIBILITY,
  PORTFOLIO_SECTIONS,
  normalizeSectionVisibility,
  type SectionVisibility,
} from "@/lib/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteSettings } from "@/lib/db/schema";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(
    DEFAULT_SECTION_VISIBILITY,
  );
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<SiteSettings>("/api/admin/settings").then((result) => {
      if (!result.ok) {
        setLoadError(result.error);
        setLoading(false);
        return;
      }
      setSettings(result.data ?? {});
      setSectionVisibility(
        normalizeSectionVisibility(result.data?.sectionVisibility),
      );
      setLoading(false);
    });
  }, []);

  async function saveSettings() {
    setSaving(true);
    const result = await adminFetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, sectionVisibility }),
    });

    if (!result.ok) {
      showAdminError(result, toast);
    } else {
      const saved = (result.data as { data?: SiteSettings })?.data;
      if (saved) {
        setSettings(saved);
        setSectionVisibility(normalizeSectionVisibility(saved.sectionVisibility));
      }
      router.refresh();
      toast.success("Settings saved — portfolio updated");
    }
    setSaving(false);
  }

  async function changePassword() {
    const result = await adminFetch("/api/admin/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwords),
    });

    if (!result.ok) {
      showAdminError(result, toast);
      return;
    }

    toast.success("Password changed successfully");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }

  if (loading) return <div className="text-slate-400">Loading settings...</div>;

  if (loadError) {
    return (
      <div>
        <AdminHeader title="Settings" description="Site configuration and security" />
        <Card>
          <CardContent className="py-8 text-center text-red-300">
            <p>Could not load settings: {loadError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader title="Settings" description="Site configuration and security" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Site Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={settings.siteName ?? ""}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Site URL</Label>
              <Input
                value={settings.siteUrl ?? ""}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input
                value={settings.metaTitle ?? ""}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={settings.metaDescription ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings, metaDescription: e.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label>Maintenance Mode</Label>
              <Switch
                checked={settings.maintenanceMode ?? false}
                onCheckedChange={(v) => setSettings({ ...settings, maintenanceMode: v })}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label>Terminal Boot Sequence</Label>
              <Switch
                checked={settings.terminalBootEnabled ?? true}
                onCheckedChange={(v) =>
                  setSettings({ ...settings, terminalBootEnabled: v })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-400">
              Disable sections you don&apos;t want on your public portfolio (e.g. no
              certifications yet).
            </p>
            {PORTFOLIO_SECTIONS.map((section) => (
              <div
                key={section.key}
                className="flex items-center justify-between gap-4 rounded-lg border border-white/10 px-3 py-2"
              >
                <Label className="text-sm">{section.label}</Label>
                <Switch
                  checked={sectionVisibility[section.key]}
                  onCheckedChange={(checked) =>
                    setSectionVisibility((prev) => ({
                      ...prev,
                      [section.key]: checked,
                    }))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, currentPassword: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmPassword: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-3 sm:flex-row">
              <Button onClick={saveSettings} disabled={saving} className="w-full sm:w-auto">
                {saving ? "Saving..." : "Save All Settings"}
              </Button>
              <Button variant="outline" onClick={changePassword} className="w-full sm:w-auto">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
