"use client";

import useAuthStore from "@/stores/auth.store";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AccountSettingPassword } from "./Password";
import { ProfilePicture } from "../ProfilePicture";
import { AccountSettingProfile } from "./Profile";
import { ButtonBack } from "../ButtonBack";
import { cn } from "@/lib/utils";

export const AccountSetting = () => {
  const { user } = useAuthStore();
  const { full_name, phone_no, email, dob, gender } = user;
  return (
    <div className="flex size-full flex-col gap-4">
      <div className="space-y-6">
        <div className="flex h-16 items-center bg-primary px-2 text-primary-foreground xl:rounded-b-md">
          <ButtonBack className="gap-4 bg-transparent">Account Setting</ButtonBack>
        </div>

        <div className="flex flex-col items-center justify-center p-4 md:flex-row md:justify-between max-w-screen-md mx-auto">
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
            <ProfilePicture user={user} size={120} />
            <div className="flex h-fit items-end gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>Name</p>
                <p className={cn("", !phone_no ? "hidden" : "")}>Phone number</p>
                <p>Email</p>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">{full_name}</p>
                <p className={cn("text-muted-foreground", !phone_no ? "hidden" : "")}>{phone_no}</p>
                <p className="text-muted-foreground">{email}</p>
              </div>
            </div>
          </div>

          <div className="hidden flex-col self-start md:flex">
            <p className="flex items-center justify-center gap-1 text-sm font-medium">
              <Calendar className="size-4" />
              <span className="block leading-none">{!dob ? "" : format(`${dob}`, "PP")}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 xl:px-0">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <AccountSettingProfile user={user} />
            <AccountSettingPassword />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
