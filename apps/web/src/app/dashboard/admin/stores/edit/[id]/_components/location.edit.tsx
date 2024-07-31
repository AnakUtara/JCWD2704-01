"use client";

import { Maps } from "@/components/maps";
import { PlacesAutoComplete } from "@/components/maps/PlacesAutoComplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { useLocation } from "@/stores/latLng.store";
import { ChangeEvent, useEffect, useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { CreateStoreSelectCity } from "../../../create-store/_components/form/select-city";
import { CityType } from "@/types/cities.type";
import { storeUpadteLocSchema, storeUpadteSchema } from "@/schemas/store.schema";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { axiosInstanceCSR } from "@/lib/axios.client-config";

export const LocationStoreEdit = ({ cities, addressId }: { cities: CityType[] | undefined; addressId: string }) => {
  const { setLocation, location, results, latLng } = useLocation();
  const matches = useMediaQueries("(min-width: 640px)");
  const [selectCityId, setSelectCityId] = useState<number | undefined>();
  const [details, setDetails] = useState("");

  const handleSelect = (city_id: number) => {
    setSelectCityId(city_id);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDetails(e.target.value);
  };

  const handleChangeLocation = async () => {
    const validate = storeUpadteLocSchema.safeParse({
      address_id: addressId,
      address: results?.formatted_address,
      details,
      city_id: selectCityId,
      longitude: latLng.lng,
      latitude: latLng.lat,
    });

    if (!validate.success) {
      validate.error.issues.forEach((value) => toast.error(value.message, { richColors: false, position: "top-right" }));
    } else {
      try {
        const { address, address_id, city_id, details, latitude, longitude } = validate.data;
        await axiosInstanceCSR().patch(`/store/v1/`, {
          address_id,
          address,
          details,
          city_id,
          longitude,
          latitude,
        });
        window.location.reload()
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(`Error! ${error.response?.status}`, { richColors: false, position: "top-right" });
        }
      }
    }
  };

  return (
    <div className="flex size-full flex-col justify-between rounded-md border bg-background p-6">
      <div className="relative flex size-full flex-col gap-4">
        {!matches && (
          <PlacesAutoComplete
            className="z-10 text-lg font-medium"
            location={location}
            onAddressSelect={(address) => {
              getGeocode({ address }).then((results) => {
                const { lat, lng } = getLatLng(results[0]);
                setLocation({ lat, lng });
              });
            }}
          />
        )}
        <Maps currentLocation scrollwheel zoom={18} />
        <PlacesAutoComplete
          className="absolute right-0 top-0 z-10 w-full max-w-sm p-2 text-lg font-medium"
          variant="rich"
          location={location}
          onAddressSelect={(address) => {
            getGeocode({ address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);
              setLocation({ lat, lng });
            });
          }}
        />

        <div className="space-y-4">
          <Input type="text" minLength={5} onChange={handleChange} placeholder="Details (Block/Unit/Floor, Etc.)" />

          {cities && <CreateStoreSelectCity className="size-full" cities={cities} onCitySelect={handleSelect} label="" />}
        </div>

        <Button onClick={handleChangeLocation}>Change Location</Button>
      </div>
    </div>
  );
};
