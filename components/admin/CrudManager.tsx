"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminFetch, showAdminError } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CrudManagerProps<T extends { id: string }> {
  title: string;
  description: string;
  apiPath: string;
  emptyLabel: string;
  getItemTitle: (item: T) => string;
  getItemSubtitle?: (item: T) => string;
  renderForm: (
    item: T | null,
    onSave: (data: Partial<T>) => Promise<void>,
    onCancel: () => void,
    saving: boolean,
  ) => React.ReactNode;
}

export function CrudManager<T extends { id: string }>({
  title,
  description,
  apiPath,
  emptyLabel,
  getItemTitle,
  getItemSubtitle,
  renderForm,
}: CrudManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const result = await adminFetch<T[]>(apiPath);
    if (!result.ok) {
      setLoadError(result.error);
      setItems([]);
    } else {
      setItems(Array.isArray(result.data) ? result.data : []);
    }
    setLoading(false);
  }, [apiPath]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleSave(data: Partial<T>) {
    setSaving(true);
    const isEdit = editing !== null;
    const result = await adminFetch(apiPath, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEdit ? { ...data, id: editing.id } : data),
    });

    if (!result.ok) {
      showAdminError(result, toast);
      setSaving(false);
      return;
    }

    toast.success(isEdit ? `${title} updated successfully` : `${title} created successfully`);
    setEditing(null);
    setCreating(false);
    await fetchItems();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const result = await adminFetch(`${apiPath}?id=${id}`, { method: "DELETE" });
    if (!result.ok) {
      showAdminError(result, toast);
      return;
    }

    toast.success("Deleted successfully");
    await fetchItems();
  }

  const showForm = creating || editing !== null;

  return (
    <div>
      <AdminHeader title={title} description={description} />

      {loadError && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Could not load {title.toLowerCase()}</p>
            <p className="mt-1 text-red-200/80">{loadError}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={fetchItems}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="mb-6">
          <Button onClick={() => setCreating(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {editing ? "Edit" : "Create"} {title.replace(/s$/, "")}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderForm(editing, handleSave, () => {
            setEditing(null);
            setCreating(false);
          }, saving)}</CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      ) : items.length === 0 && !loadError ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">{emptyLabel}</CardContent>
        </Card>
      ) : (
        !showForm &&
        items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{getItemTitle(item)}</p>
                    {getItemSubtitle && (
                      <p className="truncate text-sm text-slate-400">
                        {getItemSubtitle(item)}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(item)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}
