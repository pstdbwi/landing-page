import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { IcOrg, Verivied } from "@/components/Icon/svg";
import { cn } from "@/lib/utils";

interface EposNazhirProfileProps {
  campaign: any;
  avatarClassName?: string;
  className?: string;
}

const EposNazhirProfile = ({ campaign, avatarClassName, className }: EposNazhirProfileProps) => {
  return (
    <div className={cn("my-1 lg:my-2 flex items-center space-x-2 lg:space-x-4", className)}>
      <Avatar className={cn("lg:w-10 lg:h-10 w-8 h-8 rounded-full", avatarClassName)}>
        <AvatarImage src={campaign?.lembaga?.image} className="object-center object-cover bg-gray-100" />
        <AvatarFallback>{campaign?.lembaga?.name?.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="lg:space-y-1">
        <div className="inline-flex space-x-1">
          <h2 className="text-xs lg:text-sm font-semibold text-white line-clamp-1">{campaign?.lembaga?.name}</h2>
          <Verivied />
          <IcOrg />
        </div>
        <p className="text-[10px] lg:text-xs text-gray-50">Nadzhir Terverifikasi</p>
      </div>
    </div>
  );
};

export default EposNazhirProfile;
