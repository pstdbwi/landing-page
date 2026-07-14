import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Gerakan Sadar Wakaf Jawa Timur",
  description: "Gerakan Sadar Wakaf Jawa Timur",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default Layout;
