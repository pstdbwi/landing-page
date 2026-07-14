import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { IcOrg, Verivied } from "@/components/Icon/svg";
import { Skeleton } from "@/components/Skeleton";

interface NadzhirProfileProps {
  campaign: any;
  isLoading?: boolean;
  compact?: boolean;
}

const NadzhirProfile = ({ campaign, isLoading, compact }: NadzhirProfileProps) => {
  if (isLoading) {
    return (
      <div className="my-1 lg:my-2 flex items-center space-x-2 lg:space-x-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-1 lg:my-2 flex items-center space-x-2 lg:space-x-4">
      <Avatar className={`${compact ? "w-8 h-8 bg-white/70" : "lg:w-10 lg:h-10 w-8 h-8"} rounded-full`}>
        <AvatarImage src={campaign?.lembaga?.image} className="object-center object-cover bg-gray-100" />
        <AvatarFallback>{campaign?.lembaga?.name?.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="lg:space-y-1">
        <div className="inline-flex space-x-1">
          <h2 className={`${compact ? "text-sm" : "text-xs lg:text-sm"} font-semibold text-white line-clamp-1`}>
            {campaign?.lembaga?.name}
          </h2>
          <Verivied />
          <IcOrg />
        </div>
        <p className={`${compact ? "text-xs" : "text-[10px] lg:text-xs"} text-gray-50`}>Nadzhir Terverifikasi</p>
      </div>
    </div>
  );
};

export default NadzhirProfile;
