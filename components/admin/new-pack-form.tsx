"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPack } from "@/app/admin/packs/actions";

interface Category {
  id: string;
  name: string;
}

export function NewPackForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [videoRows, setVideoRows] = useState([0, 1, 2]); // start at the minimum of 3
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("videoCount", String(videoRows.length));

    const result = await createPack(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }
    toast.success("Pack created as draft");
    router.push("/admin/packs");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="name" placeholder="Pack name" required />
        <Input name="slug" placeholder="url-slug" required pattern="[a-z0-9-]+" />
      </div>

      <textarea
        name="description"
        placeholder="Description"
        required
        rows={4}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white placeholder:text-white/40 outline-none focus-visible:border-[var(--accent-purple)]/60"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="price" type="number" step="0.01" min="0" placeholder="Price (USD)" required />
        <select
          name="categoryId"
          required
          className="h-10 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
        >
          <option value="" className="bg-[#15151D]">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#15151D]">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-white/60">Cover image</label>
        <input name="cover" type="file" accept="image/*" required className="mt-2 block w-full text-sm text-white/60" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white">Videos (3–10)</label>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={videoRows.length <= 3}
              onClick={() => setVideoRows((rows) => rows.slice(0, -1))}
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={videoRows.length >= 10}
              onClick={() => setVideoRows((rows) => [...rows, rows.length])}
            >
              <Plus className="h-3.5 w-3.5" /> Add video
            </Button>
          </div>
        </div>

        {videoRows.map((i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:grid-cols-2">
            <Input name={`video_${i}_title`} placeholder={`Video ${i + 1} title`} required />
            <input name={`video_${i}_file`} type="file" accept="video/mp4" required className="text-sm text-white/60" />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Uploading & creating..." : "Create pack"}
      </Button>
    </form>
  );
}
