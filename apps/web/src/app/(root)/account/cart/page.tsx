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
  console.log(searchParams)
  
  return (
    <main className="min-h-dvh w-full bg-secondary">
      <div className="container space-y-4 p-4">
        <ButtonBack className="gap-4">Cart</ButtonBack>
        <section className="flex flex-wrap justify-center gap-4">
          <FillterInput queryKey="s" placeholder="Search" />
          <Address />
          <Label htmlFor="store_id">
            <p>All Store</p>
            <FillterToggle name="store_id" queryKey="store_id" trueValue="all" className="h-5" />
          </Label>
        </section>
        <section className="flex min-h-screen w-full flex-col gap-y-2 py-2">
          <ul className="flex flex-col gap-y-4">
            <Suspense fallback={<h1>Loading...</h1>}>
              <CartList search={searchParams.s || ""} store={searchParams?.store} />
            </Suspense>
          </ul>
        </section>
      </div>
      <Checkout />
    </main>
  );
}
