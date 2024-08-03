import { Button } from "@/components/ui/button";
import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { SearchParams } from "@/models/search.params";
import { TStore } from "@/models/store.model";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DashboardStoreTable } from "./_components/table";
import { Revalidate } from "next/dist/server/lib/revalidate";

type GetAllStore = {
  stores: TStore[];
  totalPage: number;
};

export const generateMetadata = async () => {
  return {
    title: "Stores Dashboard",
  };
};

export const revalidate: Revalidate = 60 * 10;

const getAllStore = async ({ searchParams }: { searchParams: SearchParams }): Promise<GetAllStore | undefined> => {
  try {
    const response = await axiosInstanceSSR().get("/store/v1", { params: { ...searchParams } });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default async function DashboardStorePage({ searchParams }: { searchParams: SearchParams }) {
  const stores = await getAllStore({ searchParams });

  return (
    <main className="flex h-[calc(100dvh-73.09px)] flex-col gap-4 p-4 md:px-8 md:py-4">
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h3 className="text-center text-3xl font-bold md:text-left md:text-4xl">
          Farm2Door&nbsp;<span className="text-muted-foreground">Store</span>
        </h3>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/admin/stores/create-store" className="flex gap-2">
            <Plus />
            <span className="block">Create New Store</span>
          </Link>
        </Button>
      </div>

      <div className="flex size-full items-center justify-center">
        {stores?.stores.length ? <DashboardStoreTable data={stores} /> : <p className="text-muted-foreground">No Stores</p>}
      </div>
    </main>
  );
}
