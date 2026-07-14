import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const MurabiHeader = () => {
  return (
    <div
      className="w-full fixed top-0 left-0 right-0 py-2 flex items-center  mx-auto shadow-[0_4px_35.5px_rgba(94,94,94,0.15)] z-40"
      style={{
        background: "radial-gradient(circle at center, #0C4C55 0%, #001F2D 100%)",
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
          <div className="relative h-[30px] w-[100px] md:h-[50px] md:w-[150px]">
            <Image src="/assets/bi-horizontal-white.png" fill className="object-contain" alt="Logo BI" priority />
          </div>
          <div className="relative h-[25px] w-[25px] md:h-[45px] md:w-[45px]">
            <Image src="/assets/bi-religi.png" fill className="object-contain" alt="Logo BI Religi" priority />
          </div>
          <div className="relative h-[32px] w-[32px] md:h-[70px] md:w-[70px]">
            <Image
              src="/assets/murobbi/logo-murabbi-white.png"
              fill
              className="object-contain"
              alt="Logo Murobbi"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MurabiHeader;
