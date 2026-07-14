import { FileTextIcon, HomeIcon, User2Icon } from "lucide-react";

interface Props {
  title: string;
  icon: React.ElementType;
  link: string;
  pathName: string;
}

const NavigationItems: Props[] = [
  {
    title: "Beranda",
    icon: HomeIcon,
    pathName: "/",
    link: "/",
  },
  {
    title: "Riwayat",
    icon: FileTextIcon,
    pathName: "/history",
    link: "/history",
  },
  {
    title: "Akun",
    icon: User2Icon,
    pathName: "/accounts",
    link: "/accounts",
  },
];

export { NavigationItems };
