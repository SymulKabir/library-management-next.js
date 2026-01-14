"use client";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import { MdOutlineKeyboardCommandKey } from "react-icons/md";
import { CiBellOn } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { BsSearch } from "react-icons/bs";
import ProfileInfo from "@/shared/components/ProfileInfo";
import useStudent from "@/shared/hooks/useStudent";
import useAdmin from "@/shared/hooks/useAdmin";
import { usePathname } from "next/navigation";

const DashboardHeader = () => {
  const [user, setUser] = useState({});
  const studentState = useStudent();
  const adminState = useAdmin();
  const student = studentState?.data || null;
  const admin = adminState?.data || null;
  const pathname = usePathname();

  useEffect(() => {
    if (admin && pathname.includes("/admin")) {
      setUser({ ...admin, route: "/admin/dashboard" });
    } else if (student && pathname.includes("/dashboard")) {
      setUser({ ...student, route: "/dashboard" });
    } else {
      setUser({});
    }
  }, [student, admin]);

  return (
    <header className="dashboard-header-section">
      <div className="dashboard-header-section-container box-shadow">
        <div className="search-box">
          <BsSearch />
          <input type="text" placeholder="Search here" />
          <button>
            <MdOutlineKeyboardCommandKey />
            <strong>F</strong>
          </button>
        </div>

        <div className="profile-container">
          <div className="action-menu">
            <button>
              <CiMail />
            </button>
            <button>
              <CiBellOn />
            </button>
          </div>
          <ProfileInfo user={user} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
