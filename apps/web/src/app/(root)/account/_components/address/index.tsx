"use client";

import Link from "next/link";
import { MapPin, Plus } from "lucide-react";

import useAuthStore from "@/stores/auth.store";
import { AddressSetting } from "./AddressSetting";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "@/stores/latLng.store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AccountAddress = () => {
  const { user } = useAuthStore();
  const { isLoaded } = useLocation();
  const { push } = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      push("/");
      toast.warning("Cannot access location", {
        description: "Please turn on your location or check your internet access, for further access.",
        richColors: false,
        position: "top-right",
      });
    };
  }, [isLoaded]);

  if (!user.addresses?.length)
    return (
      <div className="px-2 pt-20">
        <Link href="/account/address/detail" className="group flex w-fit items-center gap-1 p-6 text-xl">
          <Plus className="size-6 stroke-primary transition-all duration-200 group-hover:stroke-primary/80" />
          <span className="block text-primary transition-all duration-200 group-hover:text-primary/80">Add Shipping Address</span>
        </Link>
      </div>
    );

  return (
    <div className="px-4 pt-20 xl:px-0">
      <div className="px-0 py-10 xl:px-4">
        <Card className="shadow-md sm:mx-0">
          <CardHeader>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-start gap-3">
                <CardTitle>{user.addresses[0].city.city_name}</CardTitle>
                <div className="rounded-md border bg-secondary px-[8px] py-[4px] text-sm capitalize leading-none text-muted-foreground">
                  main address
                </div>
              </div>

              <AddressSetting city={user.addresses[0].city.city_name} />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4 text-muted-foreground md:gap-2 xl:flex-row xl:justify-between">
            <div className="flex items-end gap-4">
              <MapPin className="invisible block size-5 shrink-0 stroke-primary" />
              <div>
                <div>Name</div>
                <div>Phone</div>
                <div>Email</div>
              </div>
              <div className="text-foreground">
                <div className="text-lg font-semibold">{user.full_name}</div>
                <div>{user.phone_no ? user.phone_no : "Not set"}</div>
                <div>{user.email}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <MapPin className="block size-5 shrink-0 stroke-primary" />
              <div className="max-w-md">
                <p className="line-clamp-2 text-balance text-sm">{user.addresses[0].address}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="hidden md:block">
            <CardDescription className="text-sm">
              Orders for tomorrow that are paid before 12pm will be shipped tomorrow. After that, it will be shipped the day after.
              operational hours end before 5pm.
            </CardDescription>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
