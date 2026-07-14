import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "WAKAFein FESyar",
  description: "WAKAFein FESyar 2026",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default Layout;
