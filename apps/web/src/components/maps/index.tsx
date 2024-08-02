"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleF, GoogleMap, MarkerF } from "@react-google-maps/api";

import { useLocation } from "@/stores/latLng.store";
import { mapId } from "./maps.config";
import { cn } from "@/lib/utils";
import { Circle, LocateIcon } from "lucide-react";
import { PlacesAutoComplete } from "./PlacesAutoComplete";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { Button } from "../ui/button";

export const Maps = ({
  zoom = 15,
  className,
  mapClassName,
  activateInput = false,
  marker = false,
  scrollwheel = false,
  radiusMarker = true,
  radius = 1000,
  currentLocation = false,
}: {
  zoom?: number;
  className?: string;
  mapClassName?: string;
  activateInput?: boolean;
  marker?: boolean;
  scrollwheel?: boolean;
  radiusMarker?: boolean;
  radius?: number;
  currentLocation?: boolean;
}) => {
  const {
    latLng: { lat, lng },
    location,
    setLocation,
  } = useLocation();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat, lng });
  const mapCenter = useMemo<google.maps.LatLngLiteral>(() => ({ lat, lng }), [lat, lng]);
  const mapOptions: google.maps.MapOptions = {
    mapId,
    disableDefaultUI: true,
    clickableIcons: false,
    scrollwheel,
    gestureHandling: "auto",
    tilt: 0,
  };

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onDragEnd = () => {
    const newCenter = map?.getCenter()?.toJSON() || center;
    setCenter(newCenter);
  };

  useEffect(() => {
    setCenter({ lat, lng });
  }, [lat, lng]);

  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
      setLocation(center);
    }
  }, [map, center]);

  useEffect(() => {
    if (map) {
      map.addListener("zoom_changed", () => {
        const newCenter = map.getCenter()?.toJSON() || center;
        setCenter(newCenter);
      });
    }
  }, [map]);

  return (
    <div className={cn("size-full border-border", className)}>
      {activateInput && (
        <PlacesAutoComplete
          location={location}
          onAddressSelect={(address) => {
            getGeocode({ address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);
              setLocation({ lat, lng });
            });
          }}
        />
      )}

      <div className={cn("relative size-full overflow-hidden rounded-md border", mapClassName)}>
        <GoogleMap
          options={mapOptions}
          zoom={zoom}
          center={mapCenter}
          onLoad={onLoad}
          onDragEnd={onDragEnd}
          mapContainerClassName="size-full relative"
        >
          <Circle className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-fit -translate-x-1/2 -translate-y-1/2 fill-primary/50 stroke-primary/90" />
          {marker && <MarkerF position={center} draggable />}

          {radiusMarker && (
            <CircleF
              center={center}
              radius={radius}
              options={{
                fillColor: "#caf0f8",
                strokeColor: "#48cae4",
                strokeOpacity: 0.6,
              }}
            />
          )}

          {currentLocation && (
            <Button
              onClick={() =>
                navigator.geolocation.getCurrentPosition((pos) => {
                  const { latitude, longitude } = pos.coords;
                  setCenter({ lat: latitude, lng: longitude });
                })
              }
              variant="secondary"
              className="absolute bottom-10 right-5 select-none gap-1 rounded-full border border-foreground/20 px-2 text-primary"
            >
              <LocateIcon className="size-4 stroke-primary" />
              <span className="block">Current Location</span>
            </Button>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};
