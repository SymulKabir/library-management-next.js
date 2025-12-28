'use client'
import { useState } from "react";
import "./styles.scss";
import Image from 'next/image'
import { promiseToast, successToast, warningToast } from "@/shared/utils/toast";


const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [warnings, setWarnings] = useState({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const myTask = new Promise((resolve, reject) => {
    setTimeout(() => reject("Done"), 2000);
  });
  const validateForm = () => {
    const keys = Object.keys(form);
    const newWarnings: any = {};
    keys.forEach((key) => {
      if (!form[key as keyof typeof form]) {
        newWarnings[key] = true;
      }
    });
    setWarnings(newWarnings);
    console.log('Warnings:', newWarnings);
    if (Object.keys(newWarnings).length > 0) {
      warningToast("Fill the form, then try again!");
    } else if (Object.keys(newWarnings).length == 0 && form.password !== form.confirmPassword) {
      warningToast("Passwords does not match!");
      return false
    }

    return Object.keys(newWarnings).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }




    const apiCall = async () => {
      // Simulate API call delay
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Signup failed");
      }

      return response.json();
    };

    try {
      const result = await promiseToast(apiCall(), {
        pending: "Signing up...",
        success: "Signup successful!",
        error: "Signup failed!",
      });
      console.log("API Result:", result);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const getWarningClass = (field: string) => {
    return warnings[field] ? 'warning' : '';
  }

  return (
    <div className="container ">
      <div className="auth-page">
        <div className="form-wrapper">
          <div className="form-header">
            <Image src='/logo.png' alt="Library Logo" width={100} height={100} />
            <h2>Library Signup</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={getWarningClass('name')}
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
                className={getWarningClass('email')}

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
                className={getWarningClass('password')}
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
                className={getWarningClass('confirmPassword')}

              />
            </label>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

