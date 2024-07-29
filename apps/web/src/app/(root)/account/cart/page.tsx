import { Suspense } from "react";
import CheckoutAddressOption from "./_components/selectAddress";
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
    <main className="min-h-screen w-full bg-secondary">
      <div className="container p-4 space-y-4">
        <ButtonBack>
          Cart
        </ButtonBack>
        <section className="flex flex-wrap justify-center gap-4 p-2">
          <FillterInput queryKey="s" placeholder="Search" />
          <CheckoutAddressOption />
          <Label htmlFor="store_id">
            <p>All Store</p>
            <FillterToggle name="store_id" queryKey="store_id" trueValue="all" className="h-5" />
          </Label>
        </section>
        <section className="flex min-h-screen w-full flex-col gap-y-2 px-4 py-2">
          <ul className="flex flex-col gap-y-4">
            <Suspense fallback={<h1>Loading...</h1>}>
              <CartList search={searchParams.s || ""} store={searchParams?.store} />
            </Suspense>
          </ul>
        </section>
        <Checkout />
      </div>
    </main>
  );
}
