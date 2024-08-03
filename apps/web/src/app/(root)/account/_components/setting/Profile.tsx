import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideUserRoundCog } from "lucide-react";

import { Form } from "@/components/ui/form";
import { ButtonSubmit } from "@/components/ui/button-submit";
import { ProfileAvatarInput } from "./ProfileAvatarInput";
import { ProfielDobInput } from "./ProfileDobInput";
import { ProfileInput } from "./ProfileInput";
import { TUser } from "@/models/user.model";
import { changeProfileSubmit } from "@/utils/form/handlers/auth";
import { changeProfileSchema, ChangeProfileType } from "@/schemas/user.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAuthStore from "@/stores/auth.store";

export const AccountSettingProfile = ({ user }: { user: TUser }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isChange, setIsChange] = useState(true);
  const form = useForm<ChangeProfileType>({ resolver: zodResolver(changeProfileSchema) });
  const handleClick = () => buttonRef.current?.click();
  const { dob, full_name, phone_no } = form.getValues();
  const { keepLogin } = useAuthStore();

  useEffect(() => {
    setIsChange(!Boolean(dob || full_name || phone_no));
  }, [dob, full_name, phone_no]);
  return (
    <Dialog>
      <DialogTrigger asChild className="p-0">
        <span className="flex w-full cursor-pointer items-center justify-start gap-4 rounded-md px-2 py-4 transition-all duration-300 hover:bg-accent hover:text-accent-foreground">
          <span className="block rounded-full bg-primary/10 p-2">
            <LucideUserRoundCog className="size-6 stroke-primary" />
          </span>
          <span className="block">
            <span className="block">Edit Account</span>
            <span className="block text-sm text-muted-foreground">Change your Profile Picture, Name, Etc. </span>
          </span>
        </span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">Edit Account</DialogTitle>
          <DialogDescription className="text-left text-sm">
            Update your profile information, including your profile picture, name, phone number and email.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((paylaod) => changeProfileSubmit(paylaod, keepLogin))} className="space-y-4">
            <ProfileAvatarInput form={form} user={user} setIsChange={setIsChange} />
            <ProfileInput form={form} name="full_name" label="Full Name" placeholder={`${user.full_name}`} />
            <ProfileInput form={form} name="phone_no" label="Phone Number" placeholder={`${user.phone_no ? user.phone_no : "+62"}`} />
            <ProfielDobInput form={form} dob={user.dob || ""} />
            <button ref={buttonRef} disabled={isChange} type="submit" className="hidden"></button>
          </form>
        </Form>

        <DialogFooter className="mt-2">
          <ButtonSubmit
            isSubmitting={form.formState.isSubmitting}
            disable={isChange}
            label="Save your Profile"
            type="button"
            onClick={handleClick}
          />
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
