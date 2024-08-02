"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const ButtonBack = ({
  children,
  className,
  size,
  isCenter = true,
}: {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  isCenter?: boolean;
}) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={cn("relative flex w-full items-center justify-center gap-0.5 text-lg font-medium sm:text-xl md:justify-normal", className)}
    >
      <ChevronLeft size={size} className={cn("left-0 stroke-primary-foreground md:relative", isCenter ? "absolute" : "")} />
      <span className="inline-block">{children}</span>
    </button>
  );
};
