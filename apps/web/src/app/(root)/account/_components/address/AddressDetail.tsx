"use client";

import { Maps } from "@/components/maps";
import { useLocation } from "@/stores/latLng.store";
import { MapPin } from "lucide-react";
import { AddressDetailForm } from "./address-form";
import { CityType } from "@/types/cities.type";

export const AccountAddressDetail = ({ cities }: { cities: CityType[] }) => {
  const { results } = useLocation();
  const label = results?.address_components?.find((address) => address.types.find((type) => type === "administrative_area_level_2"));

  return (
    <>
      <div className="h-[60%] w-full">
        <Maps currentLocation zoom={17} radiusMarker={false} scrollwheel className="z-30" />
      </div>

      <div className="absolute bottom-0 left-0 h-[42.5%] w-full rounded-t-2xl border-t bg-background p-4 xl:border-x">
        <div className="h-full space-y-4 overflow-y-scroll px-2">
          <p className="text-lg font-bold">Shipping Address</p>

          <div className="flex flex-col gap-4 p-4">
            <p className="flex items-center gap-1">
              <MapPin className="size-5 stroke-primary" />
              <span className="block truncate font-bold">{label?.long_name}</span>
            </p>
            <p className="text-sm text-muted-foreground">{results?.formatted_address}</p>
          </div>

          <AddressDetailForm cities={cities} />
        </div>
      </div>
    </>
  );
};
