"use client";
import { useState } from "react";
import "./styles.scss";
import Link from "next/link";
import HeaderLayout from "@/shared/layouts/HeaderLayout";
import { FaSignInAlt } from "react-icons/fa";
import { promiseToast, warningToast } from "@/shared/utils/toast";
const Signin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [warnings, setWarnings] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    const keys = Object.keys(form);
    const newWarnings: any = {};
    keys.forEach((key) => {
      if (!form[key as keyof typeof form]) {
        newWarnings[key] = true;
      }
    });
    setWarnings(newWarnings);
    console.log("Warnings:", newWarnings);
    if (Object.keys(newWarnings).length > 0) {
      warningToast("Fill the form, then try again!");
    }  

    return Object.keys(newWarnings).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const apiCall = async () => {
      const response = await fetch("/api/students/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const { data, message } = await response.json();

      if (!data) {
        throw new Error(message || "Signin failed");
      }
      return data;
    };

    try {
      const result = await promiseToast(apiCall(), {
        pending: "Signing up...",
        success: "Signin successful!",
        error: "Signin failed. Please try again.",
      });
      console.log("API Result:", result);
    } catch (err) {
      console.error("Signin error:", err);
    }
  };

  const getWarningClass = (field: string) => {
    return warnings[field] ? "warning" : "";
  };

  return (
    <HeaderLayout>
      <div className="container">
        <div className="auth-page">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Login</h2>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
              <label>
                Email
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  autoComplete="off"
                  className={getWarningClass("email")}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  autoComplete="off"
                  className={getWarningClass("password")}
                />
              </label>

              <button type="submit">
                <FaSignInAlt /> Login
              </button>

              <div className="nav">
                <p>Don't have an account?</p>
                <Link href={"/signup"}>Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Signin;
