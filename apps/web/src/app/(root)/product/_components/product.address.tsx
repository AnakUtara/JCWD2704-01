"use client";

import { TAddress } from "@/models/address.model";
import { useLocation } from "@/stores/latLng.store";
import { MapPin } from "lucide-react";

type Props = { store: TAddress };
export default function ProductDetailsAddress({ store }: Props) {
  const { location } = useLocation();
  const label = location?.address_components?.find((address) => address.types.find((type) => type === "administrative_area_level_3"));
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">Delivery Details:</h2>
      <div>
        <p className="text-sm font-semibold">{store?.city ? store.city.city_name + " Store" : "-"}</p>
        <p className="text-sm">{store?.address ? store.address : "-"}</p>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <MapPin className="size-4" />
        <span>Send to:</span>
        {label ? <span className="font-semibold">{label?.short_name}</span> : <span>Accessing your location...</span>}
      </div>
    </div>
  );
}
