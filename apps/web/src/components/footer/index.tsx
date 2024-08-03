import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-accent pb-20 sm:pb-[7.5rem]">
      <div className="container flex w-full flex-col items-center justify-center gap-4 px-4 py-6 sm:gap-2.5 md:py-4">
        <div className="flex size-full flex-col items-center sm:justify-between md:flex-row">
          <div className="flex flex-col items-center gap-2">
            <Image src={"/footer.png"} alt="Farm2Door Footer" width={203} height={203} className="size-auto object-contain" />
            <p className="text-muted-foreground">
              &copy;{new Date().getFullYear()}&nbsp;<span className="font-bold text-foreground">Farm2Door</span>.&nbsp;All rights reserved.
            </p>
          </div>
          <div className="mt-3 flex flex-col items-center gap-2 md:items-end md:self-end">
            <Image src={"/logo/Farm2Door-logo.png"} alt="Farm2Door Logo" width={203} height={45} className="w-60 object-contain" />
            <p>Follow Our Socials:</p>
            <div className="flex gap-4">
              <Link href="/" target="_blank">
                <Facebook className="stroke-muted-foreground transition-colors duration-200 hover:stroke-foreground" />
              </Link>
              <Link href="/" target="_blank">
                <Instagram className="stroke-muted-foreground transition-colors duration-200 hover:stroke-foreground" />
              </Link>
              <Link href="/" target="_blank">
                <Twitter className="stroke-muted-foreground transition-colors duration-200 hover:stroke-foreground" />
              </Link>
              <Link href="/" target="_blank">
                <Mail className="stroke-muted-foreground transition-colors duration-200 hover:stroke-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
