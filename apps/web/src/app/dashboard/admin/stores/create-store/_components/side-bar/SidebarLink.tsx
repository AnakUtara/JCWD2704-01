"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SidebarLink = ({ id, href, label }: { id: number; href: string; label: string }) => {
  const pathname = usePathname();

  return (
    <li className="z-10">
      <Link href={href} className="flex items-center gap-4">
        <Button
          asChild
          variant="outline"
          className={cn(
            "flex items-center justify-center rounded-[50%] border-foreground/50 hover:bg-primary/90 hover:text-primary-foreground",
            pathname === href.split("?").shift() ? "border-border bg-primary text-primary-foreground" : "",
          )}
        >
          <span className="block leading-none">{id}</span>
        </Button>
        <span
          className={cn(
            "hidden truncate text-lg font-medium capitalize text-muted-foreground transition-colors duration-300 md:block",
            pathname === href.split("?").shift() ? "text-foreground" : "",
          )}
        >
          {label}
        </span>
      </Link>
    </li>
  );
};
