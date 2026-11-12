import { prisma } from "@/lib/prisma";
import { NewPackForm } from "@/components/admin/new-pack-form";

export default async function NewPackPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-white">New Pack</h1>
      <p className="mt-1 text-sm text-white/50">
        Upload 3–10 videos. Created as a draft — publish it from the Products list once reviewed.
      </p>
      <div className="mt-6">
        <NewPackForm categories={categories} />
      </div>
    </div>
  );
}
