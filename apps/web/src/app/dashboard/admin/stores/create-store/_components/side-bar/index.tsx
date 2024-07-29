import { CreateStoreRoutes } from "@/types/store.action.types";
import { BackBtn } from "./BackBtn";
import { SidebarLink } from "./SidebarLink";
import { Separator } from "@/components/ui/separator";

const link = [
  { label: "Store Info", href: CreateStoreRoutes.STEP_ONE },
  { label: "Assign Admin", href: CreateStoreRoutes.STEP_TWO },
  { label: "Review Store", href: CreateStoreRoutes.STEP_THREE },
];

export const SideBarCreateStore = () => {
  return (
    <aside className="flex h-fit flex-row gap-4 rounded-md border bg-background px-4 py-4 shadow md:flex-col md:px-0">
      <div className="size-fit px-0 md:px-6">
        <BackBtn link={link} />
      </div>

      <Separator className="hidden md:block" />

      <ul className="relative flex w-full flex-row justify-between px-0 md:w-fit md:flex-col md:gap-6 md:px-6">
        {link.map((link, idx) => (
          <SidebarLink key={`${link.label}-${idx + 1}`} id={idx + 1} {...link} />
        ))}
        <li className="absolute left-0 top-1/2 block h-px w-full bg-foreground/50 md:hidden" />
      </ul>
    </aside>
  );
};
