import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Gebyar Muharram 1448H",
  description: "Gebyar Muharram 1448H",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default Layout;
