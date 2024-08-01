"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useLocation } from "@/stores/latLng.store";
import { ChevronDown, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useMediaQueries } from "@/hooks/use-media-queries";
import Link from "next/link";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "../ui/dialog";
import { useEffect, useState } from "react";
import { Maps } from "../maps";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { axiosInstanceCSR } from "@/lib/axios.client-config";

export const HeaderPlaces = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const { matches } = useMediaQueries("(min-width: 640px)"); // isDesktop
  const { location } = useLocation();
  const label = location?.address_components.find((address) => address.types.find((type) => type === "administrative_area_level_3"));
  const city = location?.address_components
    ?.find((address) => address.types.find((type) => type === "administrative_area_level_2"))
    ?.long_name.replace("Kota", "")
    .replace("Kabupaten", "");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  async function cityHandler() {
    const res = await axiosInstanceCSR().get("/cities/city", { params: { name: city } });
    const cityID = res.data.results.city_id;
    cityID ? params.set("city_id", cityID) : params.delete("city_id");
    replace(`${pathname}?${params.toString()}`);
  }
  useEffect(() => {
    if (city) cityHandler();
  }, [city]);
  if (matches)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" disabled={!label} className={cn("", className)}>
            {label ? (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                <p className="max-w-sm truncate text-sm">
                  Send to&nbsp;<span className="font-semibold">{label?.short_name}</span>
                </p>
                <ChevronDown />
              </div>
            ) : (
              <p>Cannot access your location</p>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DrawerHeader>
            <DrawerTitle>Select detail location</DrawerTitle>
          </DrawerHeader>

          <div className="h-60">
            <DialogClose asChild>
              <Link href="/account/address" className="size-full">
                <Maps zoom={matches ? 18 : 19} className="pointer-events-none" />
              </Link>
            </DialogClose>
          </div>

          <DialogFooter>
            <DialogDescription>
              Orders for tomorrow that are paid before 12pm will be shipped tomorrow. After that, it will be shipped the day after.
              operational hours end before 5pm.
            </DialogDescription>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm" disabled={!label} className={cn("", className)}>
          {label ? (
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              <p className="max-w-sm truncate text-sm">
                Send to&nbsp;<span className="font-semibold">{label?.short_name}</span>
              </p>
              <ChevronDown />
            </div>
          ) : (
            <p>Cannot access your location</p>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select detail location</DrawerTitle>
        </DrawerHeader>

        <div className="h-80 px-4">
          <DrawerClose asChild>
            <Link href="/account/address" className="size-full">
              <Maps zoom={matches ? 18 : 19} className="pointer-events-none" />
            </Link>
          </DrawerClose>
        </div>

        <DrawerFooter>
          <DrawerDescription>
            Orders for tomorrow that are paid before 12pm will be shipped tomorrow. After that, it will be shipped the day after.
            operational hours end before 5pm.
          </DrawerDescription>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
