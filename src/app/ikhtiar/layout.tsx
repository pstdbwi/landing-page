import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "IKHTIAR RAMADHAN 1447H",
  description: "IKHTIAR RAMADHAN 1447H",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default Layout;
