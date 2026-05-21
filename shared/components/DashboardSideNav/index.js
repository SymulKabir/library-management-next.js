"use client";
import React from "react";
import Link from "next/link";
import "./styles.scss";
import Image from "next/image";
import logo from "@/public/logo.png";
import { BiSolidDashboard } from "react-icons/bi";
import { MdOutlineLogout } from "react-icons/md";
import { LuClipboardList, LuNotebookPen } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { removeAdmin } from "@/shared/store/admin/reducer";
import { removeAdminToken, removeStudentToken } from "@/shared/utils/cookies";
import { removeStudent } from "@/shared/store/student/reducer";
import { useDispatch } from "react-redux";

const ADMIN_DASHBOARD_MENUS = [
  { label: "Dashboard", svg: <BiSolidDashboard />, route: "/admin/dashboard" },
  {
    label: "Inventory",
    svg: <LuClipboardList />,
    route: "/admin/dashboard/inventory",
  },
  {
    label: "Book Issuer",
    svg: <LuNotebookPen />,
    route: "/admin/dashboard/book-issuer",
  },
];
const STUDENT_DASHBOARD_MENUS = [
  { label: "Dashboard", svg: <BiSolidDashboard />, route: "/dashboard" },
  {
    label: "Issuer History",
    svg: <LuClipboardList />,
    route: "/dashboard/issue-history",
  },
];

const DashboardSideNav = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const getActiveClass = (route) => (pathname === route ? "active" : "");

  const logOut = () => {
    if (pathname.includes("/admin")) {
      dispatch(removeAdmin());
      removeAdminToken();
    } else {
      dispatch(removeStudent());
      removeStudentToken();
    }
    router.push("/");
  };

  const GENERAL_MENUS = [
    { label: "Logout", svg: <MdOutlineLogout />, onClick: logOut },
  ];

  return (
    <header className="dashboard-side-nav-section">
      <div className="dashboard-side-nav-section-container">
        <div className="logo">
          <Link href="/">
            <Image src={logo} alt="Logo" height={100} width={100} />
          </Link>
        </div>

        <div className="nav-container">
          <h5>MENU</h5>
          <nav className="nav-menu">
            <ul>
              {pathname.includes("/admin") &&
                ADMIN_DASHBOARD_MENUS.map(({ label, svg, route }, index) => (
                  <li key={index}>
                    {route ? (
                      <Link href={route} className={getActiveClass(route)}>
                        {svg} {label}
                      </Link>
                    ) : (
                      <button>
                        {svg} {label}
                      </button>
                    )}
                  </li>
                ))}
              {!pathname.includes("/admin") &&
                STUDENT_DASHBOARD_MENUS.map(({ label, svg, route }, index) => (
                  <li key={index}>
                    {route ? (
                      <Link href={route} className={getActiveClass(route)}>
                        {svg} {label}
                      </Link>
                    ) : (
                      <button>
                        {svg} {label}
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          </nav>
        </div>

        <div className="nav-container">
          <h5>GENERAL</h5>
          <nav className="nav-menu">
            <ul>
              {GENERAL_MENUS.map(({ label, svg, onClick }, index) => (
                <li key={index}>
                  <button onClick={onClick}>
                    {svg} {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashboardSideNav;
