"use client";

import { useLocation } from "@/stores/latLng.store";
import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { googleMapsApiKey } from "./maps.config";
import useAuthStore from "@/stores/auth.store";

import { cn } from "@/lib/utils";
import Spinner from "../ui/spinner";

export const MapsProvider = ({ children, className }: { children: ReactNode; className?: string }) => {
  const libraries = useMemo<Libraries>(() => ["places"], []);
  const [isLoadApi, setIsLoadApi] = useState(false);
  const { setLocation, setIsLoaded } = useLocation();
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
      if(!isLoaded) {
        setIsLoadApi(true)
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
