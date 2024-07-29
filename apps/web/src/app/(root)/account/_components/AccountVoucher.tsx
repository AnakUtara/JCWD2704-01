"use client";

import useAuthStore from "@/stores/auth.store";

import { Card, CardContent } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { ButtonReferral } from "./ButtonReferral";
import Link from "next/link";

export const AccountVoucher = () => {
  const { user } = useAuthStore();
  return (
    <Card className="mx-auto -mt-12 max-w-2xl items-center">
      <CardContent className="flex items-center justify-between pt-6">
        <Link
          href="/"
          className="group flex items-center gap-6 rounded-md px-2.5 py-2 transition-all duration-300 hover:bg-secondary active:scale-95"
        >
          <span className="block rounded-full p-2 transition-all duration-300 group-hover:bg-primary/10">
            <Ticket className="size-10 stroke-primary" />
          </span>
          <p className="flex flex-col">
            <span className="inline-block font-medium">
              Farm2Door <span className="text-primary">Voucher</span>
            </span>
            <span className="inline-block text-muted-foreground">{user.promotions?.length} Voucher</span>
          </p>
        </Link>

        <div className="text-end">
          <p className="select-none px-3 text-sm text-muted-foreground">Referral No.</p>
          <ButtonReferral />
        </div>
      </CardContent>
    </Card>
  );
};
