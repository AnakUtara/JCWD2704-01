import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import Image from "next/image";
import { NEXT_PUBLIC_BASE_API_URL } from "@/config/config";

type Props = { control: UseFormReturn<any>; name: string; placeholder?: string; label: string; data?: any; aspect?: "square" | "video" };
export default function FormFile({ control, name, placeholder = "Input file here...", label, data, aspect = "square" }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    control.setValue(name, file);
  };
  return (
    <FormField
      control={control.control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps }, formState }) => (
        <FormItem className="grow">
          <FormLabel htmlFor={name} className="text-right">
            {label}
          </FormLabel>
          <Image
            src={
              control.getValues(name)
                ? window.URL.createObjectURL(control.getValues(name)!)
                : data
                  ? `${NEXT_PUBLIC_BASE_API_URL}/images/${data}`
                  : "/placeholder-nonAvatar.svg"
            }
            alt={`${name} placeholder`}
            height={100}
            width={100}
            className={`aspect-${aspect} w-full rounded-md border object-cover`}
          />
          <FormControl>
            <Input
              placeholder={placeholder}
              accept="image/*"
              type="file"
              {...fieldProps}
              onChange={handleChange}
              disabled={formState.isSubmitting}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
