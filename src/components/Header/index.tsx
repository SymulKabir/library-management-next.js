"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./styles.scss";
import Image from "next/image";
import logo from "@/public/logo.png";
import ProfileInfo from "../ProfileInfo";
import { IoRocket } from "react-icons/io5";
import useStudent from "@/src/hooks/useStudent";
import useAdmin from "@/src/hooks/useAdmin";
import BookSearch from '@/src/components/BookSearch';

const Header = () => {
  const [user, setUser] = useState<Record<string, any>>({});
  const studentState = useStudent();
  const adminState = useAdmin();
  const student = studentState?.data || null;
  const admin = adminState?.data || null;
  useEffect(() => {
    if (admin) {
      setUser({ ...admin, route: "/admin/dashboard" });
    } else if (student) {
      setUser({ ...student, route: "/dashboard" });
    } else {
      setUser({});
    }
  }, [student, admin]); 

  return (
    <header className="main-header-section">
      <div className="header-container box-shadow">
        <section className="logo">
          <Link href="/">
            <Image src={logo} alt="" height={100} width={100} />
          </Link>
        </section>
        <BookSearch/>

        <section className="nav-container">
          <nav className="nav-menu">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/books">Books</Link>
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
          {user?.email && <ProfileInfo user={user} />}
        </section>
      </div>
    </header>
  );
};

export default Header;
