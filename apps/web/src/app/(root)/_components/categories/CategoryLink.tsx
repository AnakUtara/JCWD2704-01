"use client";

import Image from "next/image";
import Link from "next/link";

import useAuthStore from "@/stores/auth.store";

import { TCategory } from "@/models/category.model";
import { imageUrl } from "@/utils/imageUrl";
import { useSearchParams } from "next/navigation";

export const CategoryLink = ({ category }: { category: TCategory }) => {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  return (
    <li key={category.id} className="w-[80px] text-center">
      <Link
        href={`/categories/${category.name.toLowerCase().replaceAll(" ", "-")}?page=1&city_id=${user.addresses.length ? user.addresses[0].city_id : searchParams.get("city_id")}`}
        className="flex h-full flex-col items-center justify-between"
      >
        <Image
          src={imageUrl.render(category.image?.name)}
          alt={category.name}
          height={80}
          width={80}
          sizes="70px"
          className="size-auto shrink-0 rounded-full object-contain"
        />
        <span className="block text-sm">{category.name}</span>
      </Link>
    </li>
  );
};
