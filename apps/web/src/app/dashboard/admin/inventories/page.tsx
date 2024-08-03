import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminCRUDDialog from "../_component/admin.crud.dialog";
import { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import { DataTable } from "@/components/table/data-table";
import Pagination from "@/components/pagination";
import { SearchParams } from "@/models/search.params";
import { fetchStockHistories, fetchStocks, fetchStoreNamesIds } from "@/utils/fetch/server/store.fetch";
import { stocksColumns } from "./inventory.column";
import { fetchVariantsNamesIds } from "@/utils/fetch/server/products.fetch";
import AssignStockForm from "./_components/stock.create.form";
import { historyColumns } from "./history.column";
import { getAccTokenServer } from "@/utils/ssr.jwtdecode";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Role } from "@/models/user.model";
import { fetchAllBuyGetPromos } from "@/utils/fetch/server/promo.fetch";

export const generateMetadata = async () => {
  return {
    title: "Inventories Dashboard",
  };
};

type Props = { searchParams: SearchParams };
export default async function InventoryDashboardPage({ searchParams }: Props) {
  const activeUser = await getAccTokenServer();
  const stocks = await fetchStocks(searchParams, activeUser.store_id && activeUser.store_id);
  const stores = await fetchStoreNamesIds(searchParams);
  const variants = await fetchVariantsNamesIds(searchParams);
  const histories = await fetchStockHistories(searchParams, activeUser.store_id && activeUser.store_id);
  const buyGets = await fetchAllBuyGetPromos();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:py-8 xl:px-0">
      <Tabs defaultValue="stocks">
        <TabsList className="mb-5 grid w-full grid-cols-2 bg-neutral-200">
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="stocks">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Stocks Data</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flexitems-center gap-1 text-white">
                  <PlusCircle />
                  Assign New Stock
                </Button>
              </DialogTrigger>
              <AdminCRUDDialog title="Assign New Stock" desc="You can add new product stock to a store here.">
                <AssignStockForm stores={stores} variants={variants} promos={buyGets} />
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
            <DataTable
              placeholder="Filter stocks..."
              setSearch="search_tab1"
              columns={stocksColumns}
              data={stocks.data}
              useDate
              useStoreFilter={activeUser.role === Role.super_admin}
              stores={stores}
            />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab1" totalPages={stocks.totalPages} />
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Product History Data</h2>
          </div>
          <Suspense
            key={searchParams.page_tab2}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <DataTable
              setSearch="search_tab2"
              placeholder="Filter history..."
              columns={historyColumns}
              data={histories.data}
              useDate
              useStoreFilter={activeUser.role === Role.super_admin}
              stores={stores}
            />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab2" totalPages={histories.totalPages} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
