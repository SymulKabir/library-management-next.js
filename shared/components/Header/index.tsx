"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./styles.scss";
import Image from "next/image";
import logo from "@/public/logo.png";
import ProfileInfo from "../ProfileInfo";
import { IoRocket } from "react-icons/io5";
import useStudent from "@/shared/hooks/useStudent";
import useAdmin from "@/shared/hooks/useAdmin";

const Header = () => {
  const [user, setUser] = useState<Record<string, any>>({});
  const studentState = useStudent();
  const adminState = useAdmin();
  const student = studentState?.data || null;
  const admin = adminState?.data || null;
  useState(() => {
    console.log("call user state ====================>>>>>")
    if (admin) {
      setUser(admin);
    } else if (student) {
      setUser(student);
    } else {
      setUser({});
    }
  }, [studentState.data, adminState.data]);

  console.log("admin ====>>>", admin);
  console.log("student ====>>>", student);
  console.log("user ====>>>", user);

  return (
    <header className="main-header-section">
      <div className="header-container box-shadow">
        <div className="logo">
          <Link href="/">
            <Image src={logo} alt="" height={100} width={100} />
          </Link>
        </div>

        <div className="nav-container">
          <nav className="nav-menu">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/books">Books</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          {!user?.email && (
            <div className="header-actions">
              <Link href="/signup" className="register-btn">
                <IoRocket /> Register
              </Link>
            </div>
          )}
          {user?.email && <ProfileInfo user={adminState.data || studentState.data || {} } />}
        </div>
      </div>
    </header>
  );
};

export default Header;
