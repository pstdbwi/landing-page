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
  variant?: "default" | "gold";
};

const ReactSelectFesyar = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  label,
  className,
  fieldState,
  isLoading,
  variant = "default",
  ...props
}: SelectProps<Option, IsMulti, Group>) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isGold = variant === "gold";

  return isClient ? (
    <div className="flex w-full flex-col gap-y-1">
      {label && <Label className="text-xs font-medium text-gray-700">{label}</Label>}
      <Select
        {...props}
        menuPortalTarget={props.menuPortalTarget}
        className={cn(`rounded-md text-xs placeholder:text-xs`, className)}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "0.75rem" }),
          control: (base) => ({
            ...base,
            borderWidth: 1,
            borderColor: fieldState?.error ? "#dc2626" : isGold ? "transparent" : "#e5e7eb",
            borderRadius: 8,
            minHeight: isGold ? "32px" : base.minHeight,
            height: isGold ? "32px" : base.height,
            backgroundImage: isGold
              ? "linear-gradient(90deg, #FFE7A1 0%, #DAB95A 19.47%, #F0D398 38.94%, #DAB95A 59%, #FFE7A1 79%, rgba(218, 185, 90, 0.85) 100%)"
              : "none",
            backgroundColor: isGold
              ? "transparent"
              : props.isDisabled
                ? "rgba(17, 25, 40, 0.2)"
                : "rgb(var(--tw-color-gray-50) / 0.2)",
            color: isGold ? "#153c3e" : "white", // text-fesyar-green-500
            boxShadow: isGold ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" : base.boxShadow,
          }),
          valueContainer: (base) => ({
            ...base,
            padding: isGold ? "0 8px" : base.padding,
            height: isGold ? "30px" : base.height,
            justifyContent: isGold ? "center" : base.justifyContent,
          }),
          indicatorsContainer: (base) => ({
            ...base,
            height: isGold ? "30px" : base.height,
          }),
          singleValue: (base) => ({
            ...base,
            color: isGold ? "#153c3e" : "white",
            fontWeight: isGold ? 500 : 400,
            margin: isGold ? 0 : base.margin,
            textAlign: isGold ? "center" : base.textAlign,
            width: isGold ? "100%" : base.width,
          }),
          input: (base) => ({
            ...base,
            color: isGold ? "#153c3e" : "white",
            margin: isGold ? 0 : base.margin,
            padding: isGold ? 0 : base.padding,
            textAlign: isGold ? "center" : base.textAlign,
          }),
          placeholder: (base) => ({
            ...base,
            color: isGold ? "#153c3e" : "white",
            fontWeight: isGold ? 500 : 400,
            textAlign: isGold ? "center" : base.textAlign,
            width: isGold ? "100%" : base.width,
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: isGold ? "#153c3e" : "white",
            padding: isGold ? "2px 8px" : base.padding,
            "&:hover": {
              color: isGold ? "#153c3e" : "white",
            },
          }),
          clearIndicator: (base) => ({
            ...base,
            color: isGold ? "#153c3e" : "white",
            padding: isGold ? "2px 8px" : base.padding,
            "&:hover": {
              color: isGold ? "#153c3e" : "white",
            },
          }),
          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: isGold ? "#153c3e" : "white",
            opacity: 0.5,
            margin: isGold ? "6px 0" : base.margin,
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: isGold ? "white" : "rgba(17, 25, 40, 0.75)",
            backdropFilter: isGold ? "none" : "blur(16px) saturate(180%)",
            WebkitBackdropFilter: isGold ? "none" : "blur(16px) saturate(180%)",
            border: isGold ? "1px solid #e5e7eb" : "1px solid rgba(255, 255, 255, 0.125)",
            borderRadius: 12,
            zIndex: 999,
            marginTop: 4,
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          }),
          menuList: (base) => ({
            ...base,
            padding: 4,
          }),
          option: (base, state) => ({
            ...base,
            color: isGold ? (state.isSelected ? "white" : "#153c3e") : "white",
            backgroundColor: state.isSelected
              ? isGold
                ? "#153c3e"
                : "rgba(250, 204, 21, 0.3)"
              : state.isFocused
                ? isGold
                  ? "rgb(244, 233, 204)"
                  : "rgba(250, 204, 21, 0.3)"
                : "transparent",
            cursor: "pointer",
            borderRadius: 6,
            padding: "8px 12px",
            "&:active": {
              backgroundColor: isGold ? "#0f2b2c" : "rgba(250, 204, 21, 0.5)",
            },
          }),
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

export default ReactSelectFesyar;
