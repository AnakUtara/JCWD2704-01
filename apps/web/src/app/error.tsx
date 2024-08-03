"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-y-2 px-4 text-center">
      <Image src="/500.svg" alt="Oops... Internal Server Error 500" width={203} height={203} className="w-96" />
      <h2 className="max-w-[640px] text-2xl font-semibold">{error.message}</h2>
      <p>{JSON.stringify(error?.cause)}</p>
      <div className="flex gap-2">
        <Button size={"lg"} variant={"outline"} type="button" className="text-lg" onClick={() => router.push("/")}>
          <Home className="mr-2" />
          Back To Home
        </Button>
        <Button size={"lg"} variant={"destructive"} type="button" className="text-lg" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
