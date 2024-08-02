import FillterInput from "@/components/fillter/fillterInput";
import FillterDateTime from "@/components/fillter/fillterDateTime";
import { Suspense } from "react";
import OrderList from "@/components/order/orderList";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleAlert } from "lucide-react";
import { ButtonBack } from "../_components/ButtonBack";

type Props = {
  searchParams: {
    s: string;
  };
};

export default function Page({ searchParams }: Props) {
  return (
    <TooltipProvider>
      <main className="container flex h-screen flex-col bg-secondary">
        <div className="flex h-20 items-center bg-primary px-2 text-primary-foreground xl:rounded-b-md">
          <ButtonBack className="gap-4">Orders</ButtonBack>
        </div>

        <div className="px-4 py-6 md:px-0">
          <section className="container flex flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col gap-2">
              <FillterInput name="inv" queryKey="inv" className="w-full max-w-[360px] md:max-w-full" placeholder="Search by invoice" />
              <div className="flex gap-2">
                <FillterDateTime queryKey="before" label="Start From" />
                <FillterDateTime name="after" queryKey="after" label="End To" />
                <Tooltip>
                  <TooltipTrigger className="self-start">
                    <CircleAlert className="size-4 shrink-0 stroke-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm text-muted-foreground">Check from and to the date of your order.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <div className="flex">
                <FillterInput name="product" queryKey="pn" placeholder="Search by Product Name" />
              </div>
            </div>
          </section>
          {/* Table */}
          <section className="p-x-2 my-4 flex size-full flex-col justify-between">
            <Suspense fallback={<h1>Loading...</h1>}>
              <OrderList searchParams={searchParams} />
            </Suspense>
          </section>
        </div>
      </main>
    </TooltipProvider>
  );
}
