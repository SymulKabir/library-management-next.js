import React, { ReactNode } from "react";
import Header from "@/shared/components/Header/index";

type HeaderLayoutProps = {
  children: ReactNode;
};

const HeaderLayout = ({ children }: HeaderLayoutProps) => {
  return (
    <section>
      <section>
        <Header />
      </section>
      <section>{children}</section>
    </section>
  );
};

export default HeaderLayout;
