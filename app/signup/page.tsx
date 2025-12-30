"use client";
import { useState } from "react";
import "./styles.scss";
import { promiseToast, warningToast } from "@/shared/utils/toast";
import Link from "next/link";
import HeaderLayout from "@/shared/layouts/HeaderLayout";
import { IoRocket } from "react-icons/io5";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [processing, setProcessing] = useState({
    signup: false,
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
    } else if (
      Object.keys(newWarnings).length == 0 &&
      form.password !== form.confirmPassword
    ) {
      warningToast("Passwords does not match!");
      return false;
    }

    return Object.keys(newWarnings).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (processing.signup) {
      return;
    }
    if (!validateForm()) return;

    const apiCall = async () => {
      try {
        setProcessing((state) => {
          return {
            ...state,
            signup: true,
          };
        });
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const { data, message } = await response.json();

        if (!data) {
          throw new Error(message || "Signup failed");
        }
        return data;
      } catch (error) {
      } finally {
        setProcessing((state) => {
          return {
            ...state,
            signup: false,
          };
        });
      }
    };

    try {
      const result = await promiseToast(apiCall(), {
        pending: "Signing up...",
        success: "Signup successful!",
        error: "Signup failed. Please try again.",
      });
      console.log("API Result:", result);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const getWarningClass = (field: string) => {
    return warnings[field] ? "warning" : "";
  };

  return (
    <HeaderLayout>
      <div className="container ">
        <div className="auth-page">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Library Signup</h2>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <label>
                Full Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={getWarningClass("name")}
                  autoComplete="off"
                />
              </label>
              <label>
                Email
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={getWarningClass("email")}
                  autoComplete="off"
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
                  className={getWarningClass("password")}
                  autoComplete="off"
                />
              </label>
              <label>
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className={getWarningClass("confirmPassword")}
                  autoComplete="off"
                />
              </label>
              <button type="submit" disabled={processing.signup}>
                <IoRocket /> Sign Up
              </button>
              <div className="nav">
                <p>Already have an account?</p>
                <Link href={"/signin"}>Sing In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Signup;
