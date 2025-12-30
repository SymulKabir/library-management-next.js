import React from "react";
import Link from "next/link";
import "./styles.scss";
import Image from "next/image";
import logo from "@/public/logo.png";
import { IoRocket } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";
import { MdOutlineLogout } from "react-icons/md";

const DASHBOARD_MENUS = [
  {
    label: "Dashboard",
    svg: <BiSolidDashboard />,
    route: "/dashboard",
    className: "active",
  },
  {
    label: "Dashboard",
    svg: <BiSolidDashboard />,
    route: "/dashboard",
  },
  {
    label: "Dashboard",
    svg: <BiSolidDashboard />,
    route: "/dashboard",
  },
  {
    label: "Dashboard",
    svg: <BiSolidDashboard />,
    route: "/dashboard",
  },
  {
    label: "Dashboard",
    svg: <BiSolidDashboard />,
    route: "/dashboard",
  },
  {
    label: "Dashboard",
    svg: <BiSolidDashboard />,
    route: "/dashboard",
  },
];
const GENERAL_MENUS = [
  {
    label: "Logout",
    svg: <MdOutlineLogout />,  
  },
];

const DashboardSideNav = () => {
  return (
    <header className="dashboard-side-nav-section">
      <div className="dashboard-side-nav-section-container">
        <div className="logo">
          <Link href="/">
            <Image src={logo} alt="" height={100} width={100} />
          </Link>
        </div>
        <div className="nav-container">
          <h5>MENU</h5>
          <nav className="nav-menu">
            <ul>
              {DASHBOARD_MENUS.map(
                ({ label, svg, route, className }, index) => {
                  return (
                    <li key={index}>
                      {!route && (
                        <button>
                          {svg} {label}
                        </button>
                      )}
                      {route && (
                        <Link href={route} className={className}>
                          {svg} {label}
                        </Link>
                      )}
                    </li>
                  );
                }
              )}
            </ul>
          </nav>
        </div>
        <div className="nav-container">
          <h5>GENERAL</h5>
          <nav className="nav-menu">
            <ul>
              {GENERAL_MENUS.map(({ label, svg, route }, index) => {
                return (
                  <li key={index}>
                    {!route && (
                      <button>
                        {svg} {label}
                      </button>
                    )}
                    {route && (
                      <Link href={route} className={className}>
                        {svg} {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashboardSideNav;
