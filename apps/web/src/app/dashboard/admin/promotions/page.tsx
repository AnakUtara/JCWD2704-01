import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminCRUDDialog from "../_component/admin.crud.dialog";
import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import { DataTable } from "@/components/table/data-table";
import Pagination from "@/components/pagination";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { fetchAllPromos, fetchAllUserVouchers } from "@/utils/fetch/server/promo.fetch";
import { SearchParams } from "@/models/search.params";
import { promoColumns } from "./promotions.column";
import { userVouchersColumn } from "./user.vouchers.column";
import PromoCreateForm from "./_components/promo.create.form";
import { getAccTokenServer } from "@/utils/ssr.jwtdecode";
import { cn } from "@/lib/utils";
import { Role } from "@/models/user.model";

type Props = { searchParams: SearchParams };
export default async function PromotionsDashboardPage({ searchParams }: Props) {
  const admin = await getAccTokenServer();
  const promos = await fetchAllPromos(searchParams);
  const userVouchers = await fetchAllUserVouchers(searchParams);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-0 md:py-8">
      <Tabs defaultValue="promotions">
        <TabsList className={cn(admin.role === Role.store_admin ? "hidden" : "grid", "mb-5 w-full grid-cols-2")}>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="referrals">Referrals & Free Shippings</TabsTrigger>
        </TabsList>
        <TabsContent value="promotions">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Promotions Data</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className={cn(admin.role === Role.store_admin && "hidden", "flexitems-center gap-1 text-white")}>
                  <PlusCircle />
                  Create New Promotion
                </Button>
              </DialogTrigger>
              <AdminCRUDDialog title="Assign New Stock" desc="You can add new product stock to a store here.">
                <PromoCreateForm />
              </AdminCRUDDialog>
            </Dialog>
          </div>
          <Suspense
            key={searchParams.page_tab1}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DataTable placeholder="Filter promotions..." setSearch="search_tab1" columns={promoColumns} data={promos.data} />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab1" totalPages={promos.totalPage} />
          </div>
        </TabsContent>
        <TabsContent value="referrals" className={cn(admin.role === Role.store_admin && "hidden")}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Referrals & Free Shipping Vouchers Data</h2>
          </div>
          <Suspense
            key={searchParams.page_tab2}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DataTable setSearch="search_tab2" placeholder="Filter referrals..." columns={userVouchersColumn} data={userVouchers.data} />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab2" totalPages={userVouchers.totalPage} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
