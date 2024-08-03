import React, { Suspense } from "react";
import OrderList from "@/components/order/orderList";
import OrderFillter from "../_component/orderFillter";

type OrderListProps = {
  query: { [k: string]: string };
};

export const generateMetadata = async () => {
  return {
    title: "Orders Dashboard",
  };
};
export default function Page({ searchParams }: { searchParams: OrderListProps["query"] }) {
  return (
    <main className="w-full px-4">
      <h1 className="my-4 text-center text-2xl font-bold">Order List</h1>
      <OrderFillter />
      <input type="number"></input>
      <Suspense fallback={<h1>Loading...</h1>}>
        <OrderList searchParams={searchParams}></OrderList>
      </Suspense>
    </main>
  );
}
