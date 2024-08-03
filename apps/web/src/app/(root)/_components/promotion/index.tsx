"use client";

import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { Progress } from "@/components/ui/progress";
import { imageUrl } from "@/utils/imageUrl";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export const Promotion = ({ datas }: { datas: { result: { name: string }[] } | undefined }) => {
  if (!datas) return <div>No Promotion</div>;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const plugin = useRef(Autoplay({ delay: 10000 }));

  const { result } = datas;

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    setProgress((100 / (count || 100)) * current);
  }, [current, count, progress]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="-ml-0">
        {result.map((data, id) => (
          <CarouselItem key={id} className="flex aspect-[15/8] w-full items-center justify-center bg-muted-foreground/10 pl-0">
            <div className="relative size-full overflow-hidden rounded-none xl:rounded-md">
              <Image src={imageUrl.render(data.name, "/pc.jpg")} alt={`${data.name}`} fill className="object-cover" priority />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <Progress value={progress} className="absolute bottom-8 left-1/2 h-2 w-1/4 -translate-x-1/2 bg-background/50" />
    </Carousel>
  );
};
