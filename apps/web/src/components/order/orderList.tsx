import { axiosInstanceSSR } from "@/lib/axios.server-config";
import { CustomerOrders } from "@/models/order.model";
import Pagination from "@/components/pagination";
import { DataTable } from "../table/data-table";
import { orderColoumn } from "./order.coloumn";

export default async function OrderList({ searchParams }: { searchParams: { [k: string]: string } }) {
  const orders = (await axiosInstanceSSR().get("/order", { params: { ...searchParams } })).data as {
    page: { now: number; end: number };
    data: CustomerOrders[];
  };

  const ordersINV = orders.data;
  const orderList = await Promise.all(
    ordersINV.map(async ({ inv_no }) => (await axiosInstanceSSR().get("/order/" + inv_no)).data.data as CustomerOrders),
  ).catch((e) => {
    return [] as CustomerOrders[];
  });
  return (
    <>
      <DataTable placeholder="search by invoice" setSearch="inv" columns={orderColoumn} data={orderList} />
      <section className="my-4 flex justify-center">
        <Pagination getPage="page_tab1" totalPages={orders?.page.end || 1} />
      </section>
    </>
  );
}
