"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCheckout } from "@/stores/checkout";
import { toIDR } from "@/utils/toIDR";
import dynamic from "next/dynamic";

export function Checkout() {
  const { total, list } = useCheckout((s) => {
    const list = s.list;
    return { total: s.listTotal(list), list };
  });
  const CheckoutModal = dynamic(() => import("./checkoutModal"));
  return (
    <Dialog>
      <div className="container sticky bottom-0 z-20 w-full border bg-white md:fixed md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:rounded-t-md">
        <div className="flex w-full items-center justify-between px-6 py-6">
          <p className="flex gap-1">
            <span className="block text-muted-foreground">Total:</span>
            <span className="block font-semibold">{toIDR(total)}</span>
          </p>
          <DialogTrigger asChild>
            <Button disabled={list.length < 1}>
              <h1>Checkout</h1>
            </Button>
          </DialogTrigger>
        </div>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <CheckoutModal />
      </DialogContent>
    </Dialog>
  );
}
