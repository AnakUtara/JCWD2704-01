"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { TCategory } from "@/models/category.model";
import useAuthStore from "@/stores/auth.store";
import { imageUrl } from "@/utils/imageUrl";
import { Grip } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const Category = ({ data }: { data: TCategory[] | undefined }) => {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { matches } = useMediaQueries("(min-width: 640px)");

  if (!matches)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <ul className="flex w-full justify-between">
          {data?.map((category, idx) => {
            if (idx <= 3)
              return (
                <li key={category.id} className="w-[80px] text-center">
                  <Link
                    href={`/categories/${category.name.toLowerCase().replaceAll(" ", "-")}?page=1&city_id=${user.addresses.length ? user.addresses[0].city_id : searchParams.get("city_id")}`}
                    className="flex h-full flex-col items-center justify-start gap-1.5"
                  >
                    <Image
                      src={imageUrl.render(category.image?.name)}
                      alt={category.name}
                      height={50}
                      width={50}
                      sizes="50px"
                      className="size-auto shrink-0 rounded-full object-cover"
                    />
                    <span className="block text-xs text-muted-foreground md:text-sm">{category.name}</span>
                  </Link>
                </li>
              );
          })}
          <DrawerTrigger asChild>
            <button className="flex h-full w-[80px] flex-col items-center justify-start gap-1.5 text-center">
              <span className="block rounded-full bg-primary/80 p-[10px]">
                <Grip className="size-[30px] shrink-0 stroke-primary-foreground" />
              </span>
              <span className="block text-xs text-muted-foreground md:text-sm">Lainnya</span>
            </button>
          </DrawerTrigger>

          <DrawerContent className="flex flex-col items-center">
            <DrawerHeader>All Categories</DrawerHeader>
            <div className="grid w-full grid-cols-3 place-items-center gap-y-4 py-4">
              {data?.map((category) => {
                return (
                  <li key={category.id} className="group w-[80px] list-none self-start text-center">
                    <Link
                      href={`/categories/${category.name.toLowerCase().replaceAll(" ", "-")}?page=1&city_id=${user.addresses.length ? user.addresses[0].city_id : searchParams.get("city_id")}`}
                      className="flex h-full flex-col items-center justify-start gap-1.5"
                    >
                      <Image
                        src={imageUrl.render(category.image?.name)}
                        alt={category.name}
                        height={60}
                        width={60}
                        sizes="60px"
                        className="size-auto shrink-0 rounded-full object-cover"
                      />
                      <span className="block text-xs font-light text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                        {category.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </div>
          </DrawerContent>
        </ul>
      </Drawer>
    );

  return (
    <Dialog>
      <ul className="flex w-full items-center justify-between overflow-x-scroll gap-4">
        <DialogTrigger className="flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1 text-center flex-shrink-0 bg-background">
          <span className="block rounded-full bg-primary/80 p-[5px]">
            <Grip className="size-[15px] shrink-0 stroke-primary-foreground" />
          </span>
          <span className="block text-xs">All Category</span>
        </DialogTrigger>
        {data?.map((category, idx) => {
          if (idx <= 7)
            return (
              <li key={category.id} className="rounded-md border px-3 py-1 text-center flex-shrink-0 bg-background">
                <Link
                  href={`/categories/${category.name.toLowerCase().replaceAll(" ", "-")}?page=1&city_id=${user.addresses.length ? user.addresses[0].city_id : searchParams.get("city_id")}`}
                  className="flex h-full items-center justify-start gap-1.5"
                >
                  <Image
                    src={imageUrl.render(category.image?.name)}
                    alt={category.name}
                    height={30}
                    width={30}
                    sizes="30px"
                    className="size-auto shrink-0 rounded-full object-cover"
                  />
                  <span className="block text-xs">{category.name}</span>
                </Link>
              </li>
            );
        })}
      </ul>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Category</DialogTitle>
        </DialogHeader>

        <ul className="grid grid-cols-4 place-items-center gap-y-4">
          {data?.map((category, idx) => {
            return (
              <li key={category.id} className="group w-[80px] list-none self-start text-center">
                <Link
                  href={`/categories/${category.name.toLowerCase().replaceAll(" ", "-")}?page=1&city_id=${user.addresses.length ? user.addresses[0].city_id : searchParams.get("city_id")}`}
                  className="flex h-full flex-col items-center justify-start gap-1.5"
                >
                  <Image
                    src={imageUrl.render(category.image?.name)}
                    alt={category.name}
                    height={60}
                    width={60}
                    sizes="60px"
                    className="size-auto shrink-0 rounded-full object-cover"
                  />
                  <span className="block text-xs font-light text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    {category.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
