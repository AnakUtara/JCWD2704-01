"use client";
import { cn } from "@/lib/utils";
import { generatePagination } from "@/utils/pagination";
import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ getPage = "page", totalPages,className }: { totalPages: number; getPage?: string, className?:string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get(getPage) || 1);
  const allPages = generatePagination(currentPage, totalPages);
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set(getPage, String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className={cn("mt-5 inline-flex",className)}>
        <PaginationArrow direction="left" href={createPageURL(currentPage - 1)} isDisabled={currentPage <= 1} />
        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: "first" | "last" | "single" | "middle" | undefined;
            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";
            return (
              <PaginationNumber key={page} href={createPageURL(page)} page={page} position={position} isActive={currentPage === page} />
            );
          })}
        </div>
        <PaginationArrow direction="right" href={createPageURL(currentPage + 1)} isDisabled={currentPage >= totalPages} />
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = clsx("flex size-10 cursor-pointer items-center justify-center border text-sm", {
    "rounded-l-md": position === "first" || position === "single",
    "rounded-r-md": position === "last" || position === "single",
    "border-zinc-500 bg-black text-white": isActive,
    "hover:bg-gray-100": !isActive && position !== "middle",
    "text-gray-300": position === "middle",
  });

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({ href, direction, isDisabled }: { href: string; direction: "left" | "right"; isDisabled?: boolean }) {
  const className = clsx("flex size-10 items-center justify-center rounded-md border", {
    "pointer-events-none text-gray-300": isDisabled,
    "hover:bg-gray-100": !isDisabled,
    "mr-2 md:mr-4": direction === "left",
    "ml-2 md:ml-4": direction === "right",
  });
  const icon = direction === "left" ? <ChevronLeftIcon className="w-4" /> : <ChevronRightIcon className="w-4" />;
  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
