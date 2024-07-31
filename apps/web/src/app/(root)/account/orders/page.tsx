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

      <section className="container flex flex-col md:flex-row">
        <div className="my-2 flex w-full items-center justify-center gap-x-2 px-2">
          <Label htmlFor="inv" className="hidden sm:block">
            Search by Invoice:
          </Label>
          <FillterInput name="inv" queryKey="inv" className="w-full max-w-[360px]" placeholder="Search by invoice" />
        </div>
        <div className="flex w-full flex-col">
          <div>
            <Label htmlFor="product" className="hidden sm:block">
              Product
            </Label>
            <FillterInput name="product" queryKey="pn" placeholder="Search by Product Name" />
          </div>
          <div>
            <Label htmlFor="before">Before</Label>
            <FillterDateTime defaultV={new Date().getTime() - 3600000 * 24 * 365} queryKey="before" />
          </div>
          <div>
            <Label htmlFor="after">After</Label>
            <FillterDateTime name="after" queryKey="after" />
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
