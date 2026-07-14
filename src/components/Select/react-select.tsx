"use client";
import { cn } from "@/lib/utils";
import Select, { GroupBase, Props } from "react-select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { ControllerFieldState } from "react-hook-form";
import { Loader2Icon } from "lucide-react";

type SelectProps<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> = Props<
  Option,
  IsMulti,
  Group
> & {
  label?: string;
  name: string;
  className?: string;
  onChange?: (value: any) => void;
  fieldState?: ControllerFieldState;
  isLoading?: boolean;
};

const ReactSelect2 = <Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>({
  label,
  className,
  fieldState,
  isLoading,
  ...props
}: SelectProps<Option, IsMulti, Group>) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <div className="flex w-full flex-col gap-y-1">
      {label && <Label className="text-sm font-medium text-gray-700">{label}</Label>}
      <Select
        {...props}
        className={cn(`rounded-md text-sm !text-black placeholder:text-sm`, className)}
        styles={{
          control: (base) => ({
            ...base,
            borderWidth: 1,
            borderColor: fieldState?.error ? "#dc2626" : "#e5e7eb",
            borderRadius: 8,
          }),
          menu: (provided) => ({ ...provided, zIndex: 999 }),
        }}
      />

      {isLoading && (
        <span className="text-[0.65rem] text-gray-600 italic">
          <Loader2Icon className="mr-2 inline-flex h-3 w-3 animate-spin" />
          Sedang Memuat Data...
        </span>
      )}
    </div>
  ) : null;
};

export default ReactSelect2;
