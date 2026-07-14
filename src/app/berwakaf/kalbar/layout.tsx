import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "KALBAR Berwakaf",
  description: "KALBAR Berwakaf",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default Layout;
