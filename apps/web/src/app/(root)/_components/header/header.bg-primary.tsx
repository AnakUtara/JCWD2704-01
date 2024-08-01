import { HeaderCart } from "@/components/header/HeaderCart";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type Props = { href: string; useSearch?: boolean; title?: string };
export default function HeaderBgPrimary({ href, title, useSearch = true }: Props) {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between gap-5 rounded-none bg-primary p-5 text-white md:rounded-b-md">
      <Link href={href} className="flex items-center gap-3" prefetch={false}>
        <Button size={"icon"} className="border">
          <ChevronLeft />
        </Button>
      </Link>
      <Link href="/search" className={cn(!useSearch && "hidden", "w-96 min-w-72 cursor-text")}>
        <Search className="pointer-events-none" />
      </Link>
      <h2 className={cn(useSearch && "hidden", "text-2xl font-bold")}>{title}</h2>
      <HeaderCart bgColor="destructive" />
    </header>
  );
}
