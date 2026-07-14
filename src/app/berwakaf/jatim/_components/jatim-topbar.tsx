import { buttonVariants } from "@/components/ui/button";
import { useFeatureFlag } from "@/store/feature-flag-context";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WakafJatimTitle from "@/assets/jatim/wakaf-jatim-title.png";

interface Props {}

const JatimTopbar = ({}: Props) => {
  const { currentDomain } = useFeatureFlag();
  const pathName = usePathname();

  return (
    <div className="bg-fesyar-gold py-1.5 relative z-50">
      <div className="w-full bg-gradient-to-tr from-[#01464B] via-[#03B7AC] to-[#01464B] py-6  text-center flex items-center justify-between padding-x">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          {pathName != "/" ? (
            <Link
              href={"/"}
              className={buttonVariants({
                className: "flex items-center gap-1 bg-fesyar-gold hover:opacity-90 ml-4 w-fit",
                size: "sm",
              })}
            >
              <Home className="w-4 h-4 text-fesyar-green-600" />
              <span className="text-fesyar-green-600 font-semibold hidden lg:block">Beranda</span>
            </Link>
          ) : null}

          <div className="flex justify-center items-center relative z-50 w-full">
            {currentDomain ? (
              <Image
                src={WakafJatimTitle}
                alt="Gerakan Sadar Wakaf Jawa Timur"
                width={500}
                height={0}
                className="w-full max-w-[265px] lg:max-w-[425px] h-auto mix-blend-hard-light"
                priority
              />
            ) : (
              <div
                className="w-[150px] lg:w-[300px] h-[25px] lg:h-[70px] bg-gray-300 rounded-md animate-pulse"
                aria-label="Loading title image"
              />
            )}
          </div>

          {pathName != "/" ? (
            <div className={buttonVariants({ size: "sm", className: "opacity-0" })}>&nbsp;</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default JatimTopbar;
