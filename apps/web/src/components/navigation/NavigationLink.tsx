"use client";

import { Home, Search, User } from "lucide-react";
import useAuthStore from "@/stores/auth.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links: { href: string; icon: (className: string) => JSX.Element }[] = [
  {
    href: "/home",
    icon: (className) => <Home className={className} />,
  },
  {
    href: "/categories",
    icon: (className) => <Search className={className} />,
  },
  {
    href: "/account",
    icon: (className) => <User className={className} />,
  },
];

const navigation = ["/", "/account"];

export const NavigationLink = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(pathname === "/" ? "/home" : pathname);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {navigation.includes(pathname) && (
        <nav className="fixed bottom-0 left-0 z-20 flex h-20 w-full items-center justify-center md:bottom-10 md:px-4">
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
                {links.map((link, idx) => (
                  <li
                    key={idx}
                    onMouseEnter={() => setPath(link.href)}
                    className="relative h-full rounded-md transition-all ease-in-out active:bg-secondary-foreground/5 active:shadow-inner"
                  >
                    <Link
                      href={link.href === "/home" ? "/" : link.href === "/account" && !user.id ? "/auth" : link.href}
                      key={idx}
                      className="flex h-full items-center justify-center px-4"
                    >
                      {link.icon("size-8")}
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
