import {
  ArchiveIcon,
  FileBadge,
  FileTextIcon,
  InfoIcon,
  NewspaperIcon,
  PhoneIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";

interface Props {
  title: string;
  icon: React.ElementType;
  link: string;
}

const ProfileSection: Props[] = [
  {
    title: "Profil saya",
    icon: UsersIcon,
    link: "/accounts/user",
  },
  {
    title: "Wakaf saya",
    icon: ArchiveIcon,
    link: "/history",
  },
  {
    title: "Pengajuan Manfaat",
    icon: FileBadge,
    link: "/accounts/propose",
  },
];

const AboutEziswaf: Props[] = [
  {
    title: "Tentang Kami",
    icon: InfoIcon,
    link: "/accounts/about",
  },
  {
    title: "Press Release",
    icon: NewspaperIcon,
    link: "/accounts/press-release",
  },
  {
    title: "Kontak Kami",
    icon: PhoneIcon,
    link: "/accounts/contact",
  },
  {
    title: "Syarat & Ketentuan",
    icon: FileTextIcon,
    link: "/accounts/terms",
  },
  {
    title: "Kebijakan Privasi",
    icon: ShieldIcon,
    link: "/accounts/privacy-policy",
  },
  {
    title: "Tanya Jawab",
    icon: InfoIcon,
    link: "/accounts/faq",
  },
  // {
  //     title: 'Berikan Rating',
  //     icon: 'star',
  //     link: ''
  // },
  // {
  //     title: 'Bagikan Aplikasi',
  //     icon: 'share-2',
  //     link: '#'
  // },
];

export { AboutEziswaf, ProfileSection };
