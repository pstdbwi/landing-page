import { buttonVariants } from "@/components/ui/button";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const EposHeader = () => {
  return (
    <div className="w-full fixed top-0 left-0 right-0 py-2 flex items-center  mx-auto shadow-[0_4px_35.5px_rgba(94,94,94,0.15)] z-40 bg-[#071c3d] bg-[radial-gradient(circle_at_top,_#205398_0%,_#071c3d_70%)]">
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto px-2">
        <Link
          href={"/"}
          className={buttonVariants({
            className: "flex items-center gap-1 bg-fesyar-gold hover:opacity-90",
            size: "sm",
          })}
        >
          <Home className="w-4 h-4 text-fesyar-green-600" />{" "}
          <span className="hidden md:inline text-fesyar-green-600 font-semibold">Beranda</span>
        </Link>

        <Image height={100} width={365} src={"/assets/wakafein/logo-topbar.png"} alt="logo" />
      </div>
    </div>
  );
};

export default EposHeader;
