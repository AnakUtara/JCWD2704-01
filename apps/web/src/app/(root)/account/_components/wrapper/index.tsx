"use client";

import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/auth.store";
import Link from "next/link";
import { ProfilePicture } from "../ProfilePicture";

export const AccountWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  if (!user.id)
    return (
      <div className="container flex flex-col items-center justify-center gap-6 bg-primary px-4 py-10 text-primary-foreground sm:justify-between md:flex-row md:items-end md:rounded-b-md">
        <div className="text-balance text-center md:text-left">
          <p className="text-lg font-bold md:text-xl">Sign in to take advantage of our special offers.</p>
          <p>Sing in for further access.</p>
        </div>

        <Button asChild variant="secondary" className="w-full text-lg font-medium md:max-w-sm">
          <Link href="/auth">Sign In</Link>
        </Button>
      </div>
    );

  return (
    <section className="container pb-24 sm:pb-0">
      <div className="space-y-6 bg-primary py-4 px-8 pb-20 text-primary-foreground xl:rounded-b-md">
        <h3 className="text-lg font-semibold sm:text-xl">Account</h3>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex w-full justify-between">
            <div className="flex gap-4">
              <ProfilePicture user={user} />
              <div className="">
                <p className="text-xl font-medium">{user.full_name}</p>
                <p className="text-primary-foreground/80">{user.phone_no}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
};
