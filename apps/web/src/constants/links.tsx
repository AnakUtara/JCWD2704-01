import { SearchParams } from "@/models/search.params";
import { formatSearchParams } from "@/utils/formatter";
import { ArrowLeftRight, Home, MapPin, Search, Settings, ShoppingCart, User } from "lucide-react";
import { ReadonlyURLSearchParams } from "next/navigation";

export const navLinks: { href: string; label?: string; icon: (className: string) => JSX.Element }[] = [
  {
    href: "/home",
    icon: (className) => <Home className={className} />,
  },
  {
    href: "/categories",
    icon: (className) => <Search className={className} />,
  },
  {
    href: "/account/cart",
    icon: (className) => <ShoppingCart className={className} />,
  },
  {
    href: "/account",
    icon: (className) => <User className={className} />,
  },
];

type Link = {
  href: (searchParams: ReadonlyURLSearchParams) => string;
  label: string;
  icon: (className: string) => JSX.Element;
  sub?: Link[];
};

export const headerLink: Link[] = [
  {
    href: (searchParams: ReadonlyURLSearchParams) => `/?city_id=${searchParams.get("city_id")}`,
    label: "Home",
    icon: (className) => <Home className={className} />,
  },
  {
    href: (searchParams: ReadonlyURLSearchParams) =>
      `/categories/${formatSearchParams(searchParams.get("category_name") || "buah")}?city_id=${searchParams.get("city_id")}`,
    label: "Categories",
    icon: (className) => <Search className={className} />,
  },
  {
    href: (searchParams?: ReadonlyURLSearchParams) => "/account",
    label: "Account",
    icon: (className) => <User className={className} />,
    sub: [
      {
        href: (searchParams?: ReadonlyURLSearchParams) => "/account/cart",
        label: "Cart",
        icon: (className) => <ShoppingCart className={className} />,
      },
      {
        href: (searchParams?: ReadonlyURLSearchParams) => "/account/orders",
        label: "Order",
        icon: (className) => <ArrowLeftRight className={className} />,
      },
      {
        href: (searchParams?: ReadonlyURLSearchParams) => "/account/address",
        label: "Address",
        icon: (className) => <MapPin className={className} />,
      },
      {
        href: (searchParams?: ReadonlyURLSearchParams) => "/account/setting",
        label: "Setting",
        icon: (className) => <Settings className={className} />,
      },
    ],
  },
];
