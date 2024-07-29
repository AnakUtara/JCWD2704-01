import { HeaderPlaces } from "./HeaderPlaces";
import Image from "next/image";
import { HeaderCart } from "./HeaderCart";
import Search from "../search";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="md:fixed left-0 top-0 z-50 w-full bg-gradient-to-r from-background/70 via-background/50 via-50% to-background/75 to-90% bg-clip-border text-foreground/75 backdrop-blur-[2px] backdrop-filter">
      <div className="container space-y-2 p-4 md:space-y-0">
        <div className="flex size-full items-center justify-between gap-4">
          <div className="flex w-full max-w-screen-md flex-col gap-2 sm:items-center md:max-w-screen-sm md:flex-row md:gap-4">
            <div className="flex w-full justify-between md:w-auto md:justify-normal">
              <Image
                src="/logo/Farm2Door-logo.png"
                alt="Farm2Door Logo"
                sizes="203px"
                width={203}
                height={45}
                className="size-auto object-contain"
              />
              <HeaderCart className="md:hidden" />
            </div>

            <Link href="/search" className="w-full cursor-text">
              <Search className="pointer-events-none" />
            </Link>
          </div>

          <div className="hidden items-end md:flex">
            <HeaderPlaces />
            <HeaderCart />
          </div>
        </div>

        <HeaderPlaces className="block md:hidden" />
      </div>
    </header>
  );
};
