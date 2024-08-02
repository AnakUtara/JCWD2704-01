"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { axiosInstanceCSR } from "@/lib/axios.client-config";
import useAuthStore from "@/stores/auth.store";
import { useCheckout } from "@/stores/checkout";
import { ChevronRight, CircleAlert, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Address() {
  const { user } = useAuthStore();
  const setOrigin = useCheckout((s) => s.setOrigin);
  const { push } = useRouter();
  useEffect(() => {
    const fetchStore = async () => {
      const store_id = await axiosInstanceCSR()
        .get("/store/nearest", { params: { address_id: user?.addresses?.[0]?.id } })
        .then((r) => r.data.data.id)
        .catch((e) => {
          return "origin not found";
        });
      setOrigin(store_id);
    };
    fetchStore();

    if (!user.addresses.length) push("/account/address");
  }, [user]);
  return (
    <TooltipProvider>
      <div className="flex w-full flex-col gap-2 rounded-md border bg-background py-2 md:flex-row">
        <div className="flex w-full justify-between px-4">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <User className="size-5 shrink-0 stroke-primary md:size-6" />
              <div className="w-full text-sm text-muted-foreground">
                <p className="flex gap-1.5 font-medium text-foreground">
                  <span className="block">Personal Information</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleAlert className="size-4 md:size-6" />
                    </TooltipTrigger>
                    <TooltipContent>You can change your personal information in the profile settings.</TooltipContent>
                  </Tooltip>
                </p>
                <p className="text-xs md:text-sm">
                  {user.full_name} - {user.phone_no || "Not set"}
                </p>
              </div>
            </div>
            <Button asChild size="icon" variant="ghost">
              <Link href="/account/setting">
                <ChevronRight className="size-6 shrink-0" />
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="block md:hidden" />

        <Separator orientation="vertical" className="hidden md:block" />

        <div className="flex w-full justify-between px-4">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <MapPin className="size-5 shrink-0 stroke-primary md:size-6" />
              <div className="w-full text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Send to {user.addresses[0].city.city_name} </p>
                <p className="text-xs md:text-sm">{user.addresses[0].address}</p>
              </div>
            </div>
            <Button asChild size="icon" variant="ghost" className="shrink-0">
              <Link href="/account/setting">
                <ChevronRight className="size-6 shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
