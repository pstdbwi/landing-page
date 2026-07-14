"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, qs } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { ArrowUpDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import ReactSelect2 from "@/components/Select/react-select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/Radio";

interface SortingProps extends VariantProps<typeof buttonVariants> {
  options: { value: string; label: string }[];
  className?: string;
}

const NgopiSorting = ({ variant = "outline", options, className }: SortingProps) => {
  const navigation = useRouter();
  const { order_by = "", order_type = "", ...queries } = useSearchParamsEntries();

  const [onOpen, setOnOpen] = useState(false);
  const [orderBy, setOrderBy] = useState(order_by || "");
  const [orderType, setOrderType] = useState(order_type || "asc");

  const handleApplySorting = () => {
    const filterQuery = {
      ...queries,
      order_by: orderBy,
      order_type: orderType,
    };
    navigation.push(`?${qs(filterQuery)}`, { scroll: false });
    setOnOpen(false);
  };

  const handleResetSorting = () => {
    const filterQuery = {
      ...queries,
      order_by: "",
      order_type: "",
    };

    navigation.push(`?${qs(filterQuery)}`, { scroll: false });
    setOrderBy("");
    setOrderType("asc");
    setOnOpen(false);
  };

  return (
    <DropdownMenu open={onOpen} onOpenChange={setOnOpen}>
      <DropdownMenuTrigger
        className={cn(
          "w-fit text-xs lg:text-base flex items-center gap-1 py-1.5 px-3 font-medium rounded-lg bg-fesyar-gold hover:opacity-90 tracking-wide text-fesyar-green-500 transition-all duration-200",
          className
        )}
      >
        <ArrowUpDownIcon className="w-4 h-4" />
        Urutkan
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuLabel className="text-sm">Urutkan Berdasarkan</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="my-2 flex flex-col gap-1 space-y-2 px-2">
          <Label className="text-xs">Berdasarkan</Label>
          <ReactSelect2
            name="asnaf"
            options={options}
            isClearable
            placeholder="Urutkan Berdasarkan"
            maxMenuHeight={150}
            className="min-w-[200px] placeholder:!font-bold placeholder:!text-gray-900 text-xs"
            onChange={(val) => setOrderBy(val?.value)}
            value={options?.find((opt) => opt?.value == orderBy) || null}
          />
        </div>

        <DropdownMenuSeparator />
        <div className="my-2 flex flex-col gap-1 space-y-2 px-2">
          <Label className="text-xs">Tipe</Label>
          <RadioGroup defaultValue={orderType} className="mt-1" onValueChange={(value) => setOrderType(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asc" id="asc" />
              <Label className="text-xs" htmlFor="asc">
                Ascending
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="desc" id="desc" />
              <Label className="text-xs" htmlFor="desc">
                Descending
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DropdownMenuSeparator />
        <div className="mt-2 flex items-center justify-between px-2 py-1">
          <Button type="button" size="sm" variant="outline" onClick={handleResetSorting}>
            Reset
          </Button>
          <Button type="button" size="sm" onClick={handleApplySorting} className="bg-fesyar-gold text-fesyar-green-700">
            Terapkan
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NgopiSorting;
