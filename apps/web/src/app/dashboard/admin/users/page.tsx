import { SearchParams } from "@/models/search.params";
import { fetchCustomersData, fetchStoreAdminData } from "@/utils/fetch/server/admin.fetch";
import { storeAdminColumns } from "./storeAdmin.columns";
import { Suspense } from "react";
import Pagination from "@/components/pagination";
import { customersColumns } from "./customers.column";
import Spinner from "@/components/ui/spinner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";
import AdminCRUDDialog from "../_component/admin.crud.dialog";
import StoreAdminCreateForm from "../_component/store-admin.create.form";
import { fetchAllCities } from "@/utils/fetch/server/cities.fetch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/table/data-table";

type Props = {
  searchParams: SearchParams;
};

export const generateMetadata = async () => {
  return {
    title: "Users Dashboard",
  };
};
export default async function AdminDashboard({ searchParams }: Props) {
  const storeAdmins = await fetchStoreAdminData(searchParams);
  const customers = await fetchCustomersData(searchParams);
  const cities = await fetchAllCities();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:py-8 xl:px-0">
      <Tabs defaultValue="store-admin">
        <TabsList className="mb-5 grid w-full grid-cols-2 bg-neutral-200">
          <TabsTrigger value="store-admin">Store Admins</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="store-admin">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Store Admin Data</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" className="flex items-center bg-primary text-white hover:bg-green-500">
                  <UserPlus2 /> Add Store Admin
                </Button>
              </DialogTrigger>
              <AdminCRUDDialog title="Add New Store Admin" desc="Use this form to add new store admin.">
                <StoreAdminCreateForm cities={cities} />
              </AdminCRUDDialog>
            </Dialog>
          </div>
          <Suspense
            key={searchParams.page}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DataTable layoutId="store-admin" placeholder="Filter store admins..." columns={storeAdminColumns} data={storeAdmins.users} />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab1" totalPages={storeAdmins.totalPage} />
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <h2 className="mb-5 text-3xl font-extrabold">Customers Data</h2>
          <Suspense
            key={searchParams.page}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DataTable layoutId="customers" placeholder="Filter customers..." columns={customersColumns} data={customers.users} />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab2" totalPages={customers.totalPage} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
