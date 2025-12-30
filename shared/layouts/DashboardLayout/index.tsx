import React, { ReactNode } from "react";
import DashboardSideNav from "@/shared/components/DashboardSideNav/index";
import DashboardHeader from "@/shared/components/DashboardHeader/index";
import './styles.scss'

type HeaderLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: HeaderLayoutProps) => {
  return (
    <section className="dashboard-layout">
      <section className="dashboard-side-nav">
        <DashboardSideNav />
      </section>
      <section className="content-container">
        <section className="dashboard-header">
          <DashboardHeader/>
        </section>
        <section className="dashboard-content">{children}</section>
      </section>
    </section>
  );
};

export default DashboardLayout;
