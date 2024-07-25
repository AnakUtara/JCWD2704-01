import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./button";
import { LoaderCircle } from "lucide-react";
import { VariantProps } from "class-variance-authority";

type ButtonSubmitType = {
  label: string;
  isSubmitting: boolean;
  className?: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  variants?: VariantProps<typeof buttonVariants>["variant"];
  disable?: boolean;
  onClick?: () => void;
};

export const ButtonSubmit = ({ label, isSubmitting, className, type = "submit", variants, onClick, disable }: ButtonSubmitType) => {
  return (
    <Button
      type={type}
      className={(cn('"flex justify-center" w-full items-center'), className)}
      disabled={disable || isSubmitting}
      variant={variants}
      onClick={onClick}
      onClick={onClick}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <LoaderCircle className="block size-4 motion-safe:animate-spin" />
          <span className="block">Loading</span>
        </span>
      ) : (
        <span>{label}</span>
      )}
    </Button>
  );
};
