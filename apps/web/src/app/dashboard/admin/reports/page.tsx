import Pagination from "@/components/pagination";
import Spinner from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParams } from "@/models/search.params";
import { getSalesReport, getStockReport } from "@/utils/fetch/server/report.fetch";
import { Suspense } from "react";
import { salesReportColumns } from "./sales.report.column";
import { stockReportColumns } from "./stock.report.column";
import { ReportDataTable } from "@/components/table/report.data-table";
import { fetchStoreNamesIds } from "@/utils/fetch/server/store.fetch";
import { Role } from "@/models/user.model";
import { getAccTokenServer } from "@/utils/ssr.jwtdecode";

type Props = { searchParams: SearchParams };

export const generateMetadata = async () => {
  return {
    title: "Reports Dashboard",
  };
};
export default async function DashboardReportPage({ searchParams }: Props) {
  const activeUser = await getAccTokenServer();
  const salesReport = await getSalesReport(searchParams);
  const stockReport = await getStockReport(searchParams);
  const stores = await fetchStoreNamesIds(
    activeUser.role === Role.store_admin ? { ...searchParams, store_id: activeUser.store_id } : searchParams,
  );
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:py-8 xl:px-0">
      <Tabs defaultValue="sales-rep">
        <TabsList className="mb-5 grid w-full grid-cols-2 bg-neutral-200">
          <TabsTrigger value="sales-rep">Sales Report</TabsTrigger>
          <TabsTrigger value="stock-rep">Stock Report</TabsTrigger>
        </TabsList>
        <TabsContent value="sales-rep">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Monthly Sales Report</h2>
          </div>
          <Suspense
            key={searchParams.page}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <ReportDataTable
              columns={salesReportColumns}
              data={salesReport.report}
              useStoreFilter={activeUser.role === Role.super_admin}
              stores={stores}
              filename="sales-report"
            />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab1" totalPages={Number(salesReport?.total_pages)} />
          </div>
        </TabsContent>
        <TabsContent value="stock-rep">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">Monthly Stock Report</h2>
          </div>
          <Suspense
            key={searchParams.page}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <ReportDataTable
              columns={stockReportColumns}
              data={stockReport.report}
              useStoreFilter={activeUser.role === Role.super_admin}
              stores={stores}
              filename="stock-report"
            />
          </Suspense>
          <div className="flex w-full justify-center">
            <Pagination getPage="page_tab2" totalPages={Number(salesReport?.total_pages)} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
