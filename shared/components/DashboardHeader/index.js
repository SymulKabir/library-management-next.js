'use client';
import React from "react";
import "./styles.scss";
import { MdOutlineKeyboardCommandKey } from "react-icons/md";
import { CiBellOn } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { BsSearch } from "react-icons/bs";
import ProfileInfo from "@/shared/components/ProfileInfo";
import useStudent from "@/shared/hooks/useStudent";


const DashboardHeader = () => {
  const studentState = useStudent()
  const student  = studentState.data

  

  console.log("student ------>>", student)
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
          <ProfileInfo />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
