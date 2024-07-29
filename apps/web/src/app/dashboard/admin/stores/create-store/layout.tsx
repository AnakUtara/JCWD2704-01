import { MapsProvider } from "@/components/maps/MapsProvider";
import { SideBarCreateStore } from "./_components/side-bar";
import { Separator } from "@/components/ui/separator";
import { CreateStoreProvider } from "./_components/CreateStoreProvider";

export default function DashboardCreateStoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="size-full gap-4">
      <div className="flex w-full flex-col justify-between gap-4 p-4 md:flex-row md:p-8">
        <h3 className="size-fit text-2xl font-bold leading-none md:self-end md:text-3xl">Create Store</h3>
        <p className="hidden max-w-md md:block">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, vitae? Ut sapiente aut possimus ab fugiat doloremque omnis
          quo soluta?
        </p>
      </div>
      <Separator className="block" />
      <div className="flex size-full flex-col gap-4 p-4 md:flex-row md:p-8">
        <SideBarCreateStore key={"SideBar"} />
        <MapsProvider className="size-full rounded-md border bg-background p-4 shadow md:p-8">
          <CreateStoreProvider>{children}</CreateStoreProvider>
        </MapsProvider>
      </div>
    </main>
  );
}
