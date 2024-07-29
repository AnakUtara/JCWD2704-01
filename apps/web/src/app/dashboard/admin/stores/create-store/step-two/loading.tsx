import Spinner from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex size-full items-center justify-center p-20 sm:p-52">
      <Spinner className="size-14" />
    </div>
  );
}
