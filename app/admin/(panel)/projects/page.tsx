"use client";

import { useState } from "react";

import { CrudManager } from "@/components/admin/CrudManager";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { TagInput } from "@/components/admin/TagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Project } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

function ProjectForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: Project | null;
  onSave: (data: Partial<Project>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [shortDescription, setShortDescription] = useState(item?.shortDescription ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(item?.thumbnailUrl ?? "");
  const [liveUrl, setLiveUrl] = useState(item?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(item?.githubUrl ?? "");
  const [techStack, setTechStack] = useState<string[]>(item?.techStack ?? []);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [status, setStatus] = useState(item?.status ?? "completed");
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          title,
          slug: slug || slugify(title),
          shortDescription,
          description,
          thumbnailUrl: thumbnailUrl || undefined,
          liveUrl: liveUrl || undefined,
          githubUrl: githubUrl || undefined,
          techStack,
          featured,
          status,
          sortOrder,
          images: item?.images ?? [],
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!item) setSlug(slugify(e.target.value));
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Short Description</Label>
        <Input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Description (Markdown)</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-thumbnail-upload">Thumbnail</Label>
        <ImageUpload
          inputId="project-thumbnail-upload"
          value={thumbnailUrl}
          onChange={setThumbnailUrl}
          folder="projects"
          label="Upload project thumbnail"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Live URL</Label>
          <Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>GitHub URL</Label>
          <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Tech Stack</Label>
        <TagInput value={techStack} onChange={setTechStack} placeholder="Add technology" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={featured} onCheckedChange={setFeatured} />
          <Label>Featured</Label>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Project["status"])}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          >
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminProjectsPage() {
  return (
    <CrudManager<Project>
      title="Projects"
      description="Manage your portfolio projects"
      apiPath="/api/admin/projects"
      emptyLabel="No projects yet. Add your first project!"
      getItemTitle={(item) => item.title}
      getItemSubtitle={(item) => item.shortDescription}
      renderForm={(item, onSave, onCancel, saving) => (
        <ProjectForm item={item} onSave={onSave} onCancel={onCancel} saving={saving} />
      )}
    />
  );
}
