"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const FesyarNavButton = () => {
  const pathname = usePathname();

  return (
    <div className="flex gap-3">
      <Link
        href={"/fesyar"}
        className={buttonVariants({
          className: `${
            pathname === "/fesyar"
              ? "!bg-fesyar-gold !text-fesyar-green-500"
              : "!bg-transparent transition-all duration-300 ease-in-out !text-fesyar-yellow-500 !border-fesyar-yellow-500 hover:bg-fesyar-gold hover:!text-fesyar-green-500 border z-50"
          } `,
        })}
      >
        Program
      </Link>
      <Link
        href={"/fesyar/news-article"}
        className={buttonVariants({
          className: `${
            pathname === "/fesyar/news-article"
              ? "!bg-fesyar-gold !text-fesyar-green-500"
              : "!bg-transparent transition-all duration-300 ease-in-out !text-fesyar-yellow-500 !border-fesyar-yellow-500 hover:bg-fesyar-gold hover:!text-fesyar-green-500 border z-50"
          } `,
        })}
      >
        Berita & Artikel
      </Link>
    </div>
  );
};

export default FesyarNavButton;
