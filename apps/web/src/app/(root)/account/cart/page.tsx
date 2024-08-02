import { Suspense } from "react";
import Address from "./_components/address";
import { Checkout } from "./_components/checkout";
import { CartList } from "./_components/cartList";
import FillterInput from "@/components/fillter/fillterInput";
import FillterToggle from "@/components/fillter/fillterToggle";
import { Label } from "@/components/ui/label";
import { ButtonBack } from "../_components/ButtonBack";

type Prop = {
  searchParams: { s?: string; store?: "all" };
};

export default function Page({ searchParams }: Prop) {
  return (
    <main className="min-h-dvh w-full bg-secondary">
      <div className="container flex h-16 w-full items-center bg-primary px-4 justify-between xl:rounded-b-md">
        <ButtonBack isCenter={false} className="gap-1.5 md:gap-4 text-primary-foreground w-fit">Cart</ButtonBack>
        <Label htmlFor="store_id" className="flex items-center gap-1.5">
          <p className="text-xs uppercase text-primary-foreground truncate">All Store</p>
          <FillterToggle name="store_id" queryKey="store_id" trueValue="all" className="h-5" />
        </Label>
      </div>
      <section className="container p-4">
        <div className="flex flex-wrap gap-4">
          <FillterInput queryKey="s" placeholder="Search" />
          <Address />
        </div>
        <div className="flex min-h-screen w-full flex-col gap-y-2 py-2">
          <ul className="flex flex-col gap-y-2">
            <Suspense fallback={<h1>Loading...</h1>}>
              <CartList search={searchParams.s || ""} store={searchParams?.store} />
            </Suspense>
          </ul>
        </div>
      </section>
      <Checkout />
    </main>
  );
}
