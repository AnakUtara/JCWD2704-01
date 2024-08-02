import { AccountAddress } from "../_components/address";
import { ButtonBack } from "../_components/ButtonBack";

export default function AddressPage() {
  return (
    <main className="w-full">
      <section className="container relative h-dvh">
        <div className="absolute left-0 top-0 z-20 w-full bg-background">
          <div className="flex h-16 w-full items-center bg-primary px-4 xl:rounded-b-md">
            <ButtonBack className="gap-4 text-foreground">
              <span className="text-primary-foreground">Manage Shipping Address</span>
            </ButtonBack>
          </div>
        </div>

        <AccountAddress />
      </section>
    </main>
  );
}
