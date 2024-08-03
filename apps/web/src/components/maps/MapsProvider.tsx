"use client";

import { useLocation } from "@/stores/latLng.store";
import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { googleMapsApiKey } from "./maps.config";

import { cn } from "@/lib/utils";
import Spinner from "../ui/spinner";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import { AxiosError } from "axios";

export const MapsProvider = ({ children, className }: { children: ReactNode; className?: string }) => {
  const libraries = useMemo<Libraries>(() => ["places"], []);
  const [isLoadApi, setIsLoadApi] = useState(false);
  const { setLocation, setIsLoaded, location } = useLocation();
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey, libraries });
  const city = location?.address_components
    ?.find((address) => address.types.find((type) => type === "administrative_area_level_2"))
    ?.long_name.replace("Kota", "")
    .replace("Kabupaten", "")
    .trim();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  const cityHandler = async () => {
    try {
      const res = await axiosInstanceCSR().get(`/cities/city`, { params: { name: city } });
      const cityID = res.data.results.city_id;
      cityID ? params.set("city_id", cityID) : params.delete("city_id");
      replace(`${pathname}?${params.toString()}`);
    } catch (error) {
      if (error instanceof AxiosError) console.log(error.response?.data);
    }
  }
  useEffect(() => {
    if (city !== undefined) cityHandler();
    console.log(city)
  }, [city]);

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
            position: "top-right",
            richColors: false,
          }),
      );
    }
  }, []);

  useEffect(() => {
    setIsLoadApi(isLoaded);
    setIsLoaded(isLoaded);

    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setIsLoadApi(true);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoaded]);

  return (
    <div className={cn("flex flex-col", className)}>
      {children}
      <AnimatePresence mode="wait">
        {!isLoadApi && (
          <motion.div
            initial={{ backgroundColor: "hsl(0, 0, 100 / 1)", opacity: 1 }}
            animate={{ backgroundColor: "hsl(0, 0, 100 / 0.9)", opacity: 1 }}
            exit={{ backgroundColor: "hsl(0, 0, 100 / 0)", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut", type: "tween" }}
            className={cn(
              "fixed left-0 top-0 z-[9999] flex h-screen w-full items-center justify-center bg-background p-20 sm:p-52",
              className,
            )}
          >
            <Spinner className="size-14" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
