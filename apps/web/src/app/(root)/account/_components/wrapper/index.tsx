"use client";

import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/auth.store";
import Link from "next/link";
import { ProfilePicture } from "../ProfilePicture";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { ButtonReferral } from "../ButtonReferral";
import { ButtonBack } from "../ButtonBack";

export const AccountWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const { matches } = useMediaQueries("(min-width: 640px)");

  if (!user.id)
    return (
      <div className="container flex flex-col items-center justify-center gap-6 bg-primary px-4 py-10 text-primary-foreground sm:justify-between md:flex-row md:items-end md:rounded-b-md">
        <div className="text-balance text-center md:text-left">
          <p className="text-lg font-bold md:text-xl">Sign in to take advantage of our special offers.</p>
          <p>Sign in for further access.</p>
        </div>

        <Button asChild variant="secondary" className="w-full text-lg font-medium md:max-w-sm">
          <Link href="/auth">Sign In</Link>
        </Button>
      </div>
    );

  return (
    <section className="container space-y-4 pb-16 sm:pb-0">
      <div className="">
        <div className="flex h-32 flex-col justify-between bg-primary pb-2 pt-4 md:h-40 md:rounded-b-md">
          <div className="relative mx-auto flex w-full max-w-screen-lg text-background">
            <ButtonBack className="absolute left-0 top-0 h-full w-fit gap-2 text-background" />
            <h3 className="w-full text-center text-lg font-medium">Account</h3>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex w-full justify-between px-6 md:px-0">
            <div className="relative mx-auto flex w-full max-w-screen-lg justify-between gap-4 pt-4 md:py-4">
              <div className="leading-none">
                <p className="text-lg font-medium md:text-xl">{user.full_name}</p>
                <p className="text-primary">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.phone_no}</p>
              </div>
              <ProfilePicture size={matches ? 150 : 120} user={user} className="absolute bottom-1/3 right-0 border-4 md:bottom-1/4" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4">
        <Card className="mx-auto w-full max-w-2xl items-center md:max-w-screen-lg">
          <CardContent className="flex w-full flex-wrap items-center justify-between p-0 md:p-6 md:pt-6">
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

            <div className="w-fit space-y-2 self-start p-1 sm:space-y-0 sm:text-end md:p-0">
              {/* <p className="select-none px-3 text-sm text-muted-foreground">Referral No.</p> */}
              <ButtonReferral className="text-xs md:text-base" />
            </div>
          </CardContent>
        </Card>
      </div>

      {children}
    </section>
  );
};
