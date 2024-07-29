"use client";

import { useLocation } from "@/stores/latLng.store";
import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { ReactNode, useEffect, useMemo } from "react";
import { toast } from "sonner";

import { googleMapsApiKey } from "./maps.config";

import Spinner from "../ui/spinner";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { cn } from "@/lib/utils";

export const MapsProvider = ({ children, className }: { children: ReactNode; className?: string }) => {
  const libraries = useMemo<Libraries>(() => ["places"], []);
  const { setLocation } = useLocation();
  const { matches } = useMediaQueries("(min-width: 640px)"); // isDesktop
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey, libraries });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) =>
          toast.error(error.PERMISSION_DENIED.toString(), {
            description: error.message,
          }),
      );
    }
  }, []);

  if (!isLoaded)
    return (
      <div className={cn("flex h-screen w-full items-center justify-center p-20 sm:p-52", className)}>
        <Spinner className="size-14" />
      </div>
    );

  if (matches) return <div className={cn("flex flex-col", className)}>{children}</div>;

  return <div className={cn("flex flex-col", className)}>{children}</div>;
};
