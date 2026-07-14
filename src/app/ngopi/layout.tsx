import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "WAKAFein",
  description: "Where Every Sip Serves Purposes",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default Layout;
