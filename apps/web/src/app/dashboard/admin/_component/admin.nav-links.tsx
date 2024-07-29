"use client";
import { cn } from "@/lib/utils";
import { searchParams } from "@/models/search.params";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "@/stores/auth.store";
import { Role } from "@/models/user.model";

type Props = {};
export default function AdminNavLinks({}: Props) {
  const { user: admin } = useAuthStore((s) => s);
  const baseURL = "/dashboard/admin";
  let links: { name: string; href: string }[] = [
    { name: "Users", href: `${baseURL}/users` },
    { name: "Products", href: `${baseURL}/products` },
    { name: "Categories", href: `${baseURL}/categories` },
    { name: "Stores", href: `${baseURL}/stores` },
    { name: "Inventories", href: `${baseURL}/inventories` },
    { name: "Promotions", href: `${baseURL}/promotions` },
    { name: "Orders", href: `${baseURL}/orders` },
    { name: "Reports", href: `${baseURL}/reports` },
  ];
  const pathname = usePathname();
  if (admin.role !== Role.super_admin) links = [...links.filter(({ name }) => name !== "Users" && name !== "Stores")];
  return (
    <>
      <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
        <Image src={"/logo/Farm2Door-logo.png"} width={403} height={99} alt="Farm2Door logo" className="w-40 min-w-36" />
      </Link>
      {links.map(({ name, href }) => (
        <Link
          key={name}
          href={`${href}${searchParams}`}
          className={cn(
            pathname === href ? "border-b-2 border-primary font-bold text-foreground" : "text-muted-foreground",
            "transition-colors hover:text-foreground",
          )}
        >
          {name}
        </Link>
      ))}
    </>
  );
}
