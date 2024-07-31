import OrderCard from "@/components/order/orderCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { Suspense } from "react";

export default function Page({ params }: PageProps) {
  return (
    <main className="flex w-full items-center justify-center px-10 py-16 md:py-20">
      <Card className="min-h-dvh md:max-w-md">
        <CardHeader className="text-lg font-semibold">Transaction</CardHeader>
        <CardContent>
          <span className="block font-normal text-muted-foreground">Invoice</span>
          <span className="block text-pretty text-sm font-semibold text-primary">{params.inv.replaceAll("-", " /")}</span>
        </CardContent>
        <Suspense fallback={<h1>Loading...</h1>}>
          <OrderCard inv={params.inv} />
        </Suspense>
      </Card>
    </main>
  );
}
