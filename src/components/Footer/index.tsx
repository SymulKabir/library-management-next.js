import React from "react";
import "./styles.scss";
import {
  EXPERIENCE,
  TRUST_SUPPORT, 
} from "@/src/constants/policy";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Subscription Section */}
      <section className="newsletter-section">
        <p className="sub-heading">★ Join the BookHive Community</p>
        <h2>Stay Updated: Get Library News & Book Arrivals</h2>
        <div className="input-group">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe!</button>
        </div>
      </section>

      {/* Main Footer Links */}
      <section className="main-footer">
        <div className="brand-info">
          <h3>BookHive</h3>
          <p>
            BookHive is a modern library management system designed to make
            knowledge accessible. We bridge the gap between students and
            resources with seamless borrowing, digital records, and a curated
            collection of academic excellence.
          </p>
        </div>

        <div className="links-group">
          <h4>{EXPERIENCE.title}</h4>
          <ul>
            {
              EXPERIENCE.list.map((item, index) => {
                return  <li><Link href={`/${EXPERIENCE.route}?section=${item.id}`}>{item.title}</Link></li>
              })
            }
            
          </ul>
        </div>

        <div className="links-group">
         <h4>{TRUST_SUPPORT.title}</h4>
          <ul>
            {
              TRUST_SUPPORT.list.map((item, index) => {
                return  <li><Link href={`/${TRUST_SUPPORT.route}?section=${item.id}`}>{item.title}</Link></li>
              })
            }
            
          </ul>
        </div>

        <div className="links-group"> 
          <h4>Contact & Availability</h4>
          <p>📞 +880 123 456 789</p>
          <p>✉ support@bookhive.edu</p>
        </div>
      </section>

      <div className="footer-bottom">
        <p>Copyright © BookHive Library Systems. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
