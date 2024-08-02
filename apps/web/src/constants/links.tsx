import { ArrowLeftRight, Home, MapPin, Search, Settings, ShoppingCart, User } from "lucide-react";

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

type Link = { href: string; label: string; icon: (className: string) => JSX.Element; sub?: Link[] };

export const headerLink: Link[] = [
  {
    href: "/",
    label: "Home",
    icon: (className) => <Home className={className} />,
  },
  {
    href: "/categories",
    label: "Categories",
    icon: (className) => <Search className={className} />,
  },
  {
    href: "/account",
    label: "Account",
    icon: (className) => <User className={className} />,
    sub: [
      {
        href: "/account/cart",
        label: "Cart",
        icon: (className) => <ShoppingCart className={className} />,
      },
      {
        href: "/account/orders",
        label: "Order",
        icon: (className) => <ArrowLeftRight className={className} />,
      },
      {
        href: "/account/address",
        label: "Address",
        icon: (className) => <MapPin className={className} />,
      },
      {
        href: "/account/setting",
        label: "Setting",
        icon: (className) => <Settings className={className} />,
      },
    ],
  },
];
