import { TUser } from "@/models/user.model";
import { SearchParams } from "@/models/search.params";
import { fetchStoreAdminData } from "@/utils/fetch/server/admin.fetch";
import { CreateStoreTable } from "../_components/CreateStoreTable";

const getAllStoreAdmin = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<{ users: TUser[]; totalPage: number } | undefined> => {
  try {
    const response = await fetchStoreAdminData(searchParams);
    return response;
  } catch (error) {
    console.log(JSON.stringify(error));
  }
};

export default async function DashboardCreateStoreStepThreePage({ searchParams }: { searchParams: SearchParams }) {
  const storeAdmin = await getAllStoreAdmin({ searchParams });

  return (
    <div className="flex size-full flex-col gap-4">
      <div className="flex flex-col justify-between md:flex-row md:items-end">
        <h3 className="text-2xl font-medium md:text-3xl">Store Admin</h3>
        <p className="max-w-md text-balance text-sm text-muted-foreground md:max-w-full">
          Select store admin, for the purpose of handling store stock and more.
        </p>
      </div>
      {storeAdmin && <CreateStoreTable data={storeAdmin} />}
    </div>
  );
}
