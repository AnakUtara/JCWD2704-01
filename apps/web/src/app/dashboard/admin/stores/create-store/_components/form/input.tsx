import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useResultData } from "../CreateStoreProvider";
import { ResultData } from "@/schemas/store.schema";

type InputProps = {
  label: string;
  placeholder?: string;
  id: keyof Pick<ResultData, 'details'>;
  description?: string;
  required?: boolean;
  pattern?: string;
  type: React.HTMLInputTypeAttribute;
  minLenght?: number;
  min?: number;
  max?: number;
  errorMsg?: string;
  className?: string;
};

export const CreateStoreInput = ({
  label,
  placeholder,
  id,
  description,
  required = false,
  pattern,
  type,
  minLenght,
  min,
  max,
  errorMsg,
  className,
}: InputProps) => {
  const { updateResultData, resultData } = useResultData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateResultData({ [e.target.name]: e.target.value });
  };

  return (
    <div className={cn(className)}>
      <label htmlFor={id} className="block text-lg font-medium">
        {label}
      </label>
      <Input
        type={type}
        name={id}
        id={id}
        required={required}
        pattern={pattern}
        minLength={minLenght}
        defaultValue={resultData[id]}
        min={min}
        max={max}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(errorMsg && "border-destructive")}
      />
      <div className="mt-1">
        {errorMsg ? (
          <span className="block text-sm text-destructive">{errorMsg}</span>
        ) : (
          <span className="text-muted-foreground">{description}</span>
        )}
      </div>
    </div>
  );
};
