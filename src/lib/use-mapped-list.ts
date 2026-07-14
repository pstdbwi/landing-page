"use client";

import { ISelect } from "@/types";
import { useMemo } from "react";

type MapData<T> = ISelect & T;

export default function useMappedList<T>(data: T[], mapFn: (item: T) => MapData<T>) {
    return useMemo(() => {
        return data?.map(mapFn) || [];
    }, [data, mapFn]);
}
