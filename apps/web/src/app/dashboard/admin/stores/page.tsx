import { Button } from "@/components/ui/button";
import { SearchParams } from "@/models/search.params";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardStorePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="flex h-[calc(100dvh-73.09px)] flex-col gap-4 p-4 md:p-8">
      <div className="flex w-full items-center justify-between">
        <div>Another Things</div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/stores/create-store" className="flex gap-2">
            <Plus />
            <span className="block">Create New Store</span>
          </Link>
        </Button>
      </div>
    </main>
  );
}
