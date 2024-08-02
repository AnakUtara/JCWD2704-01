"use client";
import { Button } from "@/components/ui/button";
import { toIDR } from "@/utils/toIDR";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = { className?: string };
export default function PriceRangeButtons({ className = `flex flex-col gap-3` }: Props) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  function handlePriceRange(min: number, max: number) {
    params.set("min", min.toString());
    params.set("max", max.toString());
    replace(`${pathname}?${params.toString()}`);
  }
  function handleClear() {
    params.delete("min");
    params.delete("max");
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div className={className}>
      <h2 className="text-lg font-bold">Price Range:</h2>
      <Button variant={"outline"} onClick={() => handleClear()}>
        Clear
      </Button>
      <Button variant={"outline"} onClick={() => handlePriceRange(1000, 10000)}>
        {toIDR(1000) + " - " + toIDR(10000)}
      </Button>
      <Button variant={"outline"} onClick={() => handlePriceRange(10000, 50000)}>
        {toIDR(10000) + " - " + toIDR(50000)}
      </Button>
      <Button variant={"outline"} onClick={() => handlePriceRange(100000, 500000)}>
        {toIDR(100000) + " - " + toIDR(500000)}
      </Button>
    </div>
  );
}
