import { fetchAllCities } from "@/utils/fetch/server/cities.fetch";
import { ButtonBack } from "../../_components/ButtonBack";
import { AccountAddressDetail } from "../../_components/address/AddressDetail";
import { CityType } from "@/types/cities.type";

export default async function AddressDetailPage() {
  const cities = (await fetchAllCities()) as CityType[];

  return (
    <main className="min-h-dvh w-full">
      <section className="container relative h-dvh">
        <div className="absolute left-0 top-0 z-20 w-full bg-background">
          <div className="flex h-20 w-full items-center bg-primary px-2 text-primary-foreground xl:rounded-b-md">
            <ButtonBack>Add Shipping Address</ButtonBack>
          </div>
        </div>

        <div className="relative h-dvh">
          <AccountAddressDetail cities={cities} />
        </div>
      </section>
    </main>
  );
}
