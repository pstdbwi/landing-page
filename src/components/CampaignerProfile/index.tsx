import { Avatar, AvatarImage, AvatarFallback } from "../Avatar";
import { IcOrg, Verivied } from "../Icon/svg";
interface Props {
  campaignerName: string;
  image: string;
}

const CampaignerProfile: React.FC<Props> = ({ campaignerName, image }) => {
  return (
    <div className="inline-flex items-center space-x-3 mt-2">
      <Avatar>
        <AvatarImage src={image} className="object-center object-cover bg-gray-100" />
        <AvatarFallback>{campaignerName?.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h1 className="text-sm font-semibold">{campaignerName}</h1>
        <div className="inline-flex space-x-1">
          <h2 className="text-sm text-gray-500">Nazhir Terverifikasi</h2>
          <Verivied />

          <IcOrg />
        </div>
      </div>
    </div>
  );
};
export { CampaignerProfile };
