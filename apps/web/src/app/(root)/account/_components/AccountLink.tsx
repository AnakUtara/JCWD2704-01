"use client";

import { ChevronRight, ListOrdered, MapPin, Settings, ShoppingCart } from "lucide-react";
import useAuthStore from "@/stores/auth.store";
import Link from "next/link";
import React from "react";
import { useLocation } from "@/stores/latLng.store";
import { toast } from "sonner";

type LinkType = { href: string; label: string; description: string; icon: (className: string) => React.ReactNode }[];

const accountLinks = ({ id }: { id: string }): LinkType => [
  {
    href: `/account/orders`,
    label: "Order List",
    description: "View entire history and order status",
    icon: (className) => <ListOrdered className={className} />,
  },
  {
    href: `/account/cart`,
    label: "Cart",
    description: "View entire cart",
    icon: (className) => <ShoppingCart className={className} />,
  },
  {
    href: "/account/address",
    label: "Manage shipping address",
    description: "Complete or change delivery information",
    icon: (className) => <MapPin className={className} />,
  },
  {
    href: "/account/setting",
    label: "Settings",
    description: "Manage your profile information",
    icon: (className) => <Settings className={className} />,
  },
];

export const AccountLink = () => {
  const { user } = useAuthStore();
  const { isLoaded } = useLocation();
  const links = accountLinks({ id: `${user.id}` });

  return (
    <ul className="w-full">
      {links.map(({ href, description, icon, label }) => {
        const isRequired = href === "/account/address" || href === "/account/cart";
        return (
          <React.Fragment key={label}>
            <li
              onClick={() => {
                if (!isLoaded && isRequired)
                  toast.warning("Cannot access location", {
                    description: "Please turn on your location or check your internet access, for further access.",
                    richColors: false,
                    position: "top-right",
                  });
              }}
              className="rounded-md bg-background transition-all duration-200 hover:bg-secondary active:scale-[.99]"
            >
              <Link
                key={label}
                href={isLoaded ? href : !isLoaded && isRequired ? "/" : href}
                className="flex items-center justify-between px-2 py-4"
              >
                <span className="flex items-center gap-4">
                  <span className="block rounded-full bg-primary/10 p-2">{icon("size-6 stroke-primary")}</span>

                  <span className="flex flex-col">
                    <span className="block text-base font-medium text-foreground">{label}</span>
                    <span className="block text-sm font-normal text-muted-foreground">{description}</span>
                  </span>
                </span>
                <ChevronRight />
              </Link>
            </li>
            <div className="h-px w-full bg-zinc-100" />
          </React.Fragment>
        );
      })}
    </ul>
  );
};
