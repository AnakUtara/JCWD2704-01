"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const BackBtn = ({ link }: { link: { label: string; href: string }[] }) => {
  const pathname = usePathname();
  const curentPath = pathname.split("/").pop();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const step = link.findIndex((step) => step.href.split('/').pop() === curentPath)
    setCurrentStep(step)
  },[curentPath])

  return (
    <Button asChild variant="outline" size="icon">
      <Link prefetch={true} href={link[currentStep - 1]?.href || link[0].href}>
        <ChevronLeft />
      </Link>
    </Button>
  );
};
