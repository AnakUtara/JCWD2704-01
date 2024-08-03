import usePlacesAutocomplete,  from "use-places-autocomplete";
import { Input } from "../ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "../ui/command";
import { CommandLoading } from "cmdk";

export const PlacesAutoComplete = ({
  location,
  onAddressSelect,
  className,
  label,
  variant = "default",
}: {
  location: google.maps.GeocoderResult | null;
  onAddressSelect: (address: string) => void;
  label?: string;
  className?: string;
  variant?: "default" | "rich";
}) => {
  const [open, setOpen] = useState(false);
  const placeholder = location?.address_components.find((loc) => loc.types[0] === "route")?.short_name;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const {
    ready,
    value,
    suggestions: { status, data, loading },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "id" }, language: "id" },
    debounce: 700,
    defaultValue: "Indonesia",
    cache: 86400,
  });

  useEffect(() => {
    if (!open) clearSuggestions();
  }, [open]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect && onAddressSelect(description);
          }}
          className="cursor-pointer rounded-md px-2 py-2 hover:bg-primary hover:text-primary-foreground"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div className={cn("relative", className)}>
      {variant === "default" && (
        <>
          {label && <label>{label}</label>}
          <Input role="search" value={value} disabled={!ready} onChange={handleChange} placeholder={placeholder} />

          {status === "OK" && (
            <ul role="searchbox" className="absolute z-10 w-full rounded-md border bg-background p-1 shadow-lg">
              {renderSuggestions()}
            </ul>
          )}
        </>
      )}

      {variant === "rich" && (
        <>
          <Button
            className="w-full cursor-text justify-start gap-2 text-muted-foreground"
            onClick={() => {
              setOpen(!open);
            }}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            size="sm"
          >
            <span className="block truncate">{placeholder || value}</span>
            <CommandShortcut className="hidden lg:block">⌘K</CommandShortcut>
          </Button>

          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search location..." role="search" value={value} disabled={!ready} onValueChange={setValue} className="mr-8 truncate" />
            <CommandList className="w-full">
              {status === "NOT_FOUND" && <CommandEmpty>Not Found</CommandEmpty>}

              {loading && <CommandLoading className="p-4 text-sm text-muted-foreground">Loading...</CommandLoading>}
              {status === "OK" && (
                <CommandGroup>
                  {data.map((suggestion) => {
                    const {
                      place_id,
                      description,
                      structured_formatting: { main_text, secondary_text },
                    } = suggestion;
                    return (
                      <CommandItem
                        key={place_id}
                        value={description}
                        onSelect={(value) => {
                          setValue(value, false);
                          clearSuggestions();
                          setOpen((open) => !open);
                          onAddressSelect && onAddressSelect(value);
                        }}
                        className="flex w-full cursor-pointer flex-col items-start"
                      >
                        <span className="block text-sm font-medium text-foreground">{main_text}</span>
                        <span className="block text-xs text-muted-foreground">{secondary_text}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </CommandDialog>
        </>
      )}
    </div>
  );
};
