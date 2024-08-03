import { HeaderPlaces } from "./HeaderPlaces";
import Image from "next/image";
import { HeaderCart } from "./HeaderCart";
import Search from "../search";
import Link from "next/link";
import { HeaderNavigation } from "./HeaderNavigation";
import { SearchParams } from "@/models/search.params";

type Props = {
  searchParams?: SearchParams;
};
export const Header = ({ searchParams }: Props) => {
  return (
    <header className="sticky left-0 top-0 z-50 h-20 w-full flex items-center justify-center bg-gradient-to-r from-background/70 via-background/50 via-50% to-background/75 to-90% bg-clip-border text-foreground/75 backdrop-blur-[2px] backdrop-filter">
      <div className="container relative px-4 md:px-0">
        <div className="flex size-full items-center justify-between gap-4">
          <div className="flex size-full max-w-screen-md flex-col gap-2 sm:items-center md:max-w-screen-sm md:flex-row md:gap-4">
            <div className="flex w-full justify-between items-center md:w-auto md:justify-normal">
              <Link href={`/?city_id=${searchParams?.city_id}`}>
                <Image
                  src="/logo/Farm2Door-logo.png"
                  alt="Farm2Door Logo"
                  sizes="203px"
                  width={203}
                  height={45}
                  className="size-auto object-contain"
                />
              </Link>
              <HeaderCart className="md:hidden" />
            </div>

            <Link href={`/search?page=1&city_id=${searchParams?.city_id}`} className="hidden size-full cursor-text md:block">
              <Search className="pointer-events-none" />
            </Link>
          </div>

          <div className="hidden w-full items-center justify-between md:flex">
            <HeaderNavigation />
            <div className="flex">
              <HeaderPlaces />
              <HeaderCart />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
