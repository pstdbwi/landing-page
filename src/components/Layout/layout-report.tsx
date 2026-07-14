"use client";

import { cn } from "@/lib/utils";
import { RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { Button } from "../ui/button";

interface Props extends HTMLAttributes<HTMLDivElement> {}

const LayoutReport = ({ children, className }: Props) => {
  return (
    <section className={cn("max-w-7xl mx-auto px-4 pb-6 w-full bg-white min-h-[100dvh]", className)}>
      <div className="inline-flex justify-between w-full items-center py-3 border-b border-gray-100">
        <Link href="/" prefetch>
          <img src="/assets/logo.png" alt="logo bi" width={120} height={120} className="mr-4" />
        </Link>

        <div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="text-xs">
            <RefreshCwIcon className="w-3" /> Perbarui Halaman
          </Button>
        </div>
      </div>

      {children}
    </section>
  );
};

export default LayoutReport;
