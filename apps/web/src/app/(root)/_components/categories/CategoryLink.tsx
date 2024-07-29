"use client";

import Image from "next/image";
import Link from "next/link";

import useAuthStore from "@/stores/auth.store";

import { TCategory } from "@/models/category.model";
import { imageUrl } from "@/utils/imageUrl";

export const CategoryLink = ({ category }: { category: TCategory }) => {
  const { user } = useAuthStore();

  return (
    <li key={category.id} className="w-[80px] text-center">
      <Link
        href={`/categories/${category.name.toLowerCase()}?page=1&store_id=${user.addresses.length ? user.addresses[0].city_id : 0}`}
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
