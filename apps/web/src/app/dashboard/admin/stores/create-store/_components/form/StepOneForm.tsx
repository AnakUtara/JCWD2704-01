"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { getGeocode, getLatLng } from "use-places-autocomplete";

import { useLocation } from "@/stores/latLng.store";
import { useMediaQueries } from "@/hooks/use-media-queries";

import { CityType } from "@/types/cities.type";
import { FormErrors } from "@/types/store.action.types";

import { Maps } from "@/components/maps";
import { Button } from "@/components/ui/button";
import { PlacesAutoComplete } from "@/components/maps/PlacesAutoComplete";
import { stepOneFormAction } from "@/utils/form/create-store-action/stepOne";

import { CreateStoreInput } from "./input";
import { CreateStoreSelectCity } from "./select-city";
import { useResultData } from "../CreateStoreProvider";

const initialState: FormErrors = {};
export const StepOneForm = ({ cities }: { cities: CityType[] }) => {
  const { location, results, setLocation, latLng } = useLocation();
  const { matches } = useMediaQueries("(min-width: 640px)");
  const { updateResultData, resultData } = useResultData();

  const [cityId, setCityId] = useState(resultData.city_id || 0);
  const [error, formAction] = useFormState(
    (state: FormErrors | undefined, formData: FormData) =>
      stepOneFormAction(state, formData, {
        address: results?.formatted_address!,
        city_id: cityId,
        latitude: latLng.lat,
        longitude: latLng.lng,
      }),
    initialState,
  );

  const handleSelect = (city_id: number) => {
    setCityId(city_id);
  };

  useEffect(() => {
    updateResultData({
      address: results?.formatted_address,
      city_id: cityId,
      latitude: latLng.lat,
      longitude: latLng.lng,
    });
  }, [cityId, results, latLng]);

  return (
    <form action={formAction} className="flex size-full flex-col gap-4">
      <p className="flex flex-col gap-2 text-muted-foreground xl:flex-row">
        <span className="block">Store located on:</span>
        <span className="block text-sm text-foreground md:text-base">{results?.formatted_address}</span>
      </p>

      <div className="flex size-full flex-col gap-4 md:flex-row md:gap-8">
        {!matches && (
          <>
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
            {error?.address && <div className="text-destructive">{error.address}</div>}
          </>
        )}
        <Maps currentLocation scrollwheel radiusMarker={false} zoom={17} className="h-[400px] w-full" />

        <div className="flex w-full flex-col justify-between gap-4">
          <div className="w-full space-y-4">
            {matches && (
              <>
                <PlacesAutoComplete
                  label="Search Location"
                  className="text-lg font-medium"
                  location={location}
                  onAddressSelect={(address) => {
                    getGeocode({ address }).then((results) => {
                      const { lat, lng } = getLatLng(results[0]);
                      setLocation({ lat, lng });
                    });
                  }}
                />
                {error?.address && <div className="text-destructive">{error.address}</div>}
              </>
            )}
            <CreateStoreSelectCity
              defaultValue={resultData.city_id}
              cities={cities}
              onCitySelect={handleSelect}
              errorMsg={error?.city_id}
            />
            <CreateStoreInput
              required
              label="Address Details"
              id="details"
              type="text"
              minLenght={5}
              className="w-full flex-1 flex-grow"
              placeholder="Details (Block/Unit/Floor, Etc.)"
              errorMsg={error?.details}
            />
          </div>

          <Button type="submit" className="md:w-fit md:self-end">
            Set Location
          </Button>
        </div>
      </div>
    </form>
  );
};
