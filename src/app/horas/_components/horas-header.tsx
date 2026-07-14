import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import logoBI from "@/assets/bi-horizontal-white.png";
import logoBWI from "@/assets/bwi-logo.png";
import logoPemprovSumut from "@/assets/sumut/logo-pemprov-sumut.png";

const HorasHeader = () => {
  return (
    <div
      className="w-full fixed top-0 left-0 right-0 py-2 flex items-center  mx-auto shadow-[0_4px_35.5px_rgba(94,94,94,0.15)] z-40"
      style={{
        background:
          "linear-gradient(270deg, #00484C 0%, #03B6AB 10.1%, #00484C 25.48%, #00484C 40%, #00484C 60%, #03B6AB 90%, #00484C 100%)",
      }}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto px-2">
        <Link
          href={"/"}
          className={buttonVariants({
            className: "flex items-center gap-1 bg-fesyar-gold hover:opacity-90",
            size: "sm",
          })}
        >
          <Home className="w-4 h-4 text-fesyar-green-600" />{" "}
          <span className="text-fesyar-green-600 font-semibold">Beranda</span>
        </Link>

        <div className="flex items-center gap-4">
          <Image src={logoPemprovSumut} alt="Logo Pemprov Sumut" className="h-[30px] w-auto object-contain" priority />
          <Image src={logoBI} alt="Logo BI" className="h-[25px] w-auto object-contain" priority />
          <Image src={logoBWI} alt="Logo BWI" className="h-[30px] w-auto object-contain" priority />
        </div>
      </div>
    </div>
  );
};

export default HorasHeader;
