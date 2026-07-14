"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/use-debounce";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { cn, qs } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter as useNavigation } from "next/navigation";
import React, { ComponentProps, useEffect, useState } from "react";

interface InputSearchProps extends ComponentProps<"input"> {
  keyName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InputSearch = ({ keyName = "search", placeholder = "Cari", ref, ...props }: InputSearchProps) => {
  const navigation = useNavigation();
  const query = useSearchParamsEntries() as Record<string, string>;
  const defaultValue = query?.[keyName];

  // debounce search
  const [value, setValue] = useState<string>(defaultValue || "");
  const debouncedValue = useDebounce<string>(value, 500);
  const [startDebounce, setStartDebounce] = React.useState(false);

  useEffect(() => {
    if (startDebounce) {
      const nextQuery: Record<string, string> = {
        ...query,
        ...(query?.page && { page: "0" }),
        [keyName]: debouncedValue,
      };
      if (!debouncedValue) delete nextQuery[keyName];
      navigation.push("?" + qs(nextQuery), { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 bg-white" />
      <Input
        {...props}
        name={keyName}
        type="text"
        placeholder={placeholder}
        onChange={(event) => {
          setStartDebounce(true);
          setValue(event.target.value || "");
        }}
        className={cn("bg-white pl-9 font-normal text-gray-700", props.className)}
        defaultValue={defaultValue || props.defaultValue}
      />
    </div>
  );
};

export default InputSearch;
