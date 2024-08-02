"use client";

import useAuthStore from "@/stores/auth.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { navLinks } from "@/constants/links";

const navigation = ["/", "/account"];

export const NavigationLink = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [path, setPath] = useState("");
  const { matches } = useMediaQueries("(min-width: 640px)");

  useEffect(() => {
    setPath(pathname === "/" ? "/home" : pathname);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {navigation.includes(pathname) && !matches && (
        <nav className="fixed bottom-0 left-0 z-20 flex h-14 w-full items-center justify-center md:bottom-10 md:h-20 md:px-4">
          <motion.div
            initial={{ y: "200%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "200%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.7, ease: "easeInOut" }}
            className={cn(
              "size-full max-w-screen-md border border-secondary/10 bg-gradient-to-r from-secondary-foreground/10 via-secondary-foreground/20 via-50% to-secondary-foreground/15 to-90% bg-clip-border px-4 text-foreground/75 backdrop-blur-[2px] backdrop-filter md:rounded-md md:px-2 md:py-2",
            )}
          >
            <ul
              role="navigation"
              onMouseLeave={() => setPath(pathname === "/" ? "/home" : pathname)}
              className="flex size-full items-center justify-between"
            >
              <AnimatePresence>
                {navLinks.map((link, idx) => (
                  <li
                    key={idx}
                    onMouseEnter={() => setPath(link.href)}
                    className="relative h-full rounded-md transition-all ease-in-out active:bg-secondary-foreground/5 active:shadow-inner"
                  >
                    <Link
                      href={link.href === "/home" ? "/" : link.href === "/account" && !user.id ? "/auth" : link.href}
                      key={idx}
                      className="relative flex h-full items-center justify-center md:px-4"
                    >
                      {link.icon("siize-6 md:size-8 shrink-0")}
                      {link.href === "/account/cart" && (
                        <div className="absolute right-3 top-3 flex size-4 animate-bounce items-center justify-center rounded-[50%] border bg-background font-medium leading-[0]">
                          <div>{user.cart.length}</div>
                        </div>
                      )}
                    </Link>

                    {path === link.href && (
                      <motion.span
                        layoutId="indicator"
                        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                        className="absolute bottom-0 left-0 block h-1 w-full rounded-full bg-foreground/75"
                      />
                    )}
                  </li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        </nav>
      )}
    </AnimatePresence>
  );
};
