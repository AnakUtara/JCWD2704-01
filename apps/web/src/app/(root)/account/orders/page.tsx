import { Label } from "@radix-ui/react-label";
import FillterInput from "@/components/fillter/fillterInput";
import FillterDateTime from "@/components/fillter/fillterDateTime";
import { Suspense } from "react";
import OrderList from "@/components/order/orderList";

type Props = {
  searchParams: {
    s: string;
  };
};

export default function Page({ searchParams }: Props) {
  return (
    <main className="flex h-screen flex-col bg-secondary">
      {/* Fillter */}

      <section className="container flex flex-col md:flex-row gap-4">
        <div className="flex w-full flex-col">
          <Label htmlFor="inv" className="hidden sm:block">
            Search by Invoice:
          </Label>
          <FillterInput name="inv" queryKey="inv" className="w-full" placeholder="Invoice" />
        </div>
        <div className="flex w-full flex-col">
          <div>
            <Label htmlFor="product" className="hidden sm:block">
              Product
            </Label>
            <FillterInput name="product" queryKey="pn" placeholder="Product Name" />
          </div>
          <div className="flex">
            <div>
              <Label htmlFor="before">Before</Label>
              <FillterDateTime queryKey="before" />
            </div>
            <div>
              <Label htmlFor="after">After</Label>
              <FillterDateTime name="after" queryKey="after" />
            </div>
          </div>
        </div>
      </section>
      {/* Table */}
      <section className="p-x-2 my-4 flex size-full flex-col justify-between">
        <Suspense fallback={<h1>Loading...</h1>}>
          <OrderList searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
