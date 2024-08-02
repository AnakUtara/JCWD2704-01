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
import Image from "next/image";
//TODO: Change useSearch to Farm2Door inverted logo
type Props = { searchParams: SearchParams };
export default function HeaderBgPrimary({ searchParams }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container flex w-full items-center justify-between gap-5 p-5 text-white">
        <DropdownMenu>
          <DropdownMenuTrigger className="group rounded-md border p-2 transition-colors hover:bg-primary-foreground">
            <MenuIcon className="transition-colors group-hover:text-black/80" />
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
        <Link href={`/?city_id=${searchParams.city_id}`}>
          <Image src="/logo/Farm2Door-logo-inv.png" alt="Farm2Door logo" width={100} height={100} className="w-44" />
        </Link>
        <HeaderCart bgColor="destructive" />
      </div>
    </header>
  );
}
