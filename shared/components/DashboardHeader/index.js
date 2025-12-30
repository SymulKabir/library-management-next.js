import React from "react";
import "./styles.scss";
import Image from "next/image";
import { MdOutlineKeyboardCommandKey } from "react-icons/md";
import { CiBellOn } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { BsSearch } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";

const DashboardHeader = () => {
  return (
    <header className="dashboard-header-section">
      <div className="dashboard-header-section-container box-shadow">
        <div className="search-box">
          <BsSearch/>
          <input type="text" />
          <button>
            <MdOutlineKeyboardCommandKey />
            <bold>F</bold>
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

          <div className="header-actions">
            <div className="img-container">
              <Image src={""} height={100} width={100} alt="" />
            </div>
            <div className="name-container">
              <h2>Symul Kabir</h2>
              <p>saimonpratna@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
