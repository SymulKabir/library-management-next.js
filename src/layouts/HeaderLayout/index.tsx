import React, { ReactNode } from "react";
import Header from "@/src/components/Header/index";
import Footer from "@/src/components/Footer/index";

type HeaderLayoutProps = {
  children: ReactNode;
};

const HeaderLayout = ({ children }: HeaderLayoutProps) => {
  return (
    <section>
      <section>
        <Header />
      </section>
      <section className="container">{children}</section>
      <section>
        <Footer />
      </section>
    </section>
  );
};

export default HeaderLayout;
