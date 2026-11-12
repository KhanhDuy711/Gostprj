"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { togglePublish, deletePack } from "@/app/admin/packs/actions";

export function PackRowActions({ packId, isPublished }: { packId: string; isPublished: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await togglePublish(packId, !isPublished);
            toast.success(isPublished ? "Pack unpublished" : "Pack published");
          })
        }
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            if (!confirm("Delete this pack permanently?")) return;
            await deletePack(packId);
            toast.success("Pack deleted");
          })
        }
      >
        Delete
      </Button>
    </div>
  );
}
