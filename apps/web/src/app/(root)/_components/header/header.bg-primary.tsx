import { HeaderCart } from "@/components/header/HeaderCart";
import Search from "@/components/search";
import { cn } from "@/lib/utils";
import { Home, List, MenuIcon, SearchIcon, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SearchParams } from "@/models/search.params";
import { formatSearchParams } from "@/utils/formatter";

type Props = { useSearch?: boolean; title?: string; searchParams: SearchParams };
export default function HeaderBgPrimary({ title, useSearch = true, searchParams }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container flex w-full items-center justify-between gap-5 p-5 text-white">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md border p-2 hover:bg-green-500/40">
            <MenuIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <Link href={`/?city_id=${searchParams.city_id}`}>
              <DropdownMenuItem className="gap-3">
                <Home />
                Home
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={`/search?city_id=${searchParams.city_id}`}>
              <DropdownMenuItem className="gap-3">
                <SearchIcon />
                Search
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={`/categories/${formatSearchParams(searchParams?.category_name || "buah")}?city_id=${searchParams.city_id}`}>
              <DropdownMenuItem className="gap-3">
                <List />
                Categories
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href={`/account`}>
              <DropdownMenuItem className="gap-3">
                <User />
                Account
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/search" className={cn(!useSearch && "hidden", "w-96 min-w-72 cursor-text")}>
          <Search className="pointer-events-none" />
        </Link>
        <h2 className={cn(useSearch && "hidden", "text-2xl font-bold")}>{title}</h2>
        <HeaderCart bgColor="destructive" />
      </div>
    </header>
  );
}
