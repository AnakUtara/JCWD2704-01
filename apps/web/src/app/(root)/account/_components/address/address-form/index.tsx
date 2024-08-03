import useAuthStore from "@/stores/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CityType } from "@/types/cities.type";
import { userCreateAddress, UserCreateAddressType } from "@/schemas/address.schema";

import { ButtonSubmit } from "@/components/ui/button-submit";
import { Form } from "@/components/ui/form";
import { userAddressSubmit } from "@/utils/form/handlers/address";

import { AddressInput } from "./input";
import { AddressCityInput } from "./input-city";
import { useEffect } from "react";
import { useLocation } from "@/stores/latLng.store";
import { useRouter } from "next/navigation";

export const AddressDetailForm = ({ cities }: { cities: CityType[] }) => {
  const { user, keepLogin } = useAuthStore();
  const router = useRouter();
  const { results, latLng } = useLocation();
  const form = useForm<UserCreateAddressType>({
    resolver: zodResolver(userCreateAddress),
    defaultValues: {
      latitude: latLng.lat,
      longitude: latLng.lng,
    },
  });

  useEffect(() => {
    form.setValue("address", `${results?.formatted_address}`);
    form.setValue("latitude", latLng.lat);
    form.setValue("longitude", latLng.lng);
  }, [results, latLng]);

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((payload) => userAddressSubmit(payload, router, keepLogin))}>
        <AddressInput
          form={form}
          name="details"
          label="Address Details"
          placeholder="Details (Block/Unit/Floor, Etc.)"
          address={user.addresses}
        />

        <AddressCityInput form={form} cities={cities} city={user.addresses[0]?.city.city_name} />

        <ButtonSubmit type="submit" isSubmitting={form.formState.isSubmitting} label="Save Location" className="w-full" />
      </form>
    </Form>
  );
};
