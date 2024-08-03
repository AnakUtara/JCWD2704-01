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
import { AxiosError } from "axios";

export const HeaderPlaces = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const { location } = useLocation();
  const label = location?.address_components.find((address) => address.types.find((type) => type === "administrative_area_level_3"));
  const { matches } = useMediaQueries("(min-width: 640px)"); // isDesktop

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
};
