import React from "react";
import Link from "next/link";
import "./styles.scss";
import Image from "next/image";
import logo from "@/public/logo.png";
import { IoRocket } from "react-icons/io5";

const Header = () => {
  return (
    <header className="main-header-section">
      <div className="header-container">
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

          <div className="header-actions">
            <Link href="/signup" className="register-btn">
              <IoRocket /> Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
