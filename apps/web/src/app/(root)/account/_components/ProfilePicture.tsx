import { cn } from "@/lib/utils";
import { TUser } from "@/models/user.model";
import { imageUrl } from "@/utils/imageUrl";
import Image from "next/image";

export const ProfilePicture = ({ user, size = 80 , className}: { user: TUser; size?: number; className?: string }) => {
  return (
    <Image
      src={imageUrl.render(user.avatar?.name)}
      alt={`${user.full_name} profile picture`}
      height={size}
      width={size}
      sizes="80px"
      className={cn("aspect-square rounded-full border-primary-foreground object-cover shrink-0", className)}
    />
  );
};
