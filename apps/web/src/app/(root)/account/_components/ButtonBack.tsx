"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const ButtonBack = ({ children, className, size }: { children?: React.ReactNode; className?: string; size?: number }) => {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className={cn("flex items-center gap-0.5 text-lg font-medium sm:text-xl", className)}>
      <Button asChild variant="outline" size="icon">
        <ChevronLeft size={size} />
      </Button>
      <span className="inline-block">{children}</span>
    </button>
  );
};
