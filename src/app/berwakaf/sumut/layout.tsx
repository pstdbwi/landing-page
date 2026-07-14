import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Wakaf Sumut Berkah",
  description: "Wakaf Sumut Berkah",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default Layout;
