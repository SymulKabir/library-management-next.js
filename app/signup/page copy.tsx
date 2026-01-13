"use client";
import { useState } from "react";
import "./styles.scss";
import { promiseToast, warningToast } from "@/shared/utils/toast";
import Link from "next/link";
import HeaderLayout from "@/shared/layouts/HeaderLayout";
import { IoRocket } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
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
    const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/
    const keys = Object.keys(form);
    const newWarnings: any = {};
    keys.forEach((key) => {
      if (!form[key as keyof typeof form]) {
        newWarnings[key] = true;
      }

    });
    if (Object.keys(newWarnings).length > 0) {
      warningToast("Fill the form, then try again!");
    } else if (
      phoneRegex.test(form["phone" as keyof typeof form]) === false
    ) {
      newWarnings["phone"] = true;
      warningToast("Phone number does not valid!");
    } else if (
      Object.keys(newWarnings).length == 0 &&
      form.password !== form.confirmPassword
    ) {
      newWarnings["confirmPassword"] = true;
      warningToast("Passwords does not match!");
    }
    setWarnings(newWarnings);

    return Object.keys(newWarnings).length === 0;
  };
  const apiCall = async () => {
    try {
      setProcessing((state) => {
        return {
          ...state,
          signup: true,
        };
      });
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const { data, message } = await response.json();
      console.log("Hello from signup:", { data, message });
      if (!data) {
        throw new Error(message || "Signup failed");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Signup failed")
    } finally {
      setProcessing((state) => {
        return {
          ...state,
          signup: false,
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (processing.signup) return;
    if (!validateForm()) return;

    try {
      const result = await promiseToast(apiCall(), {
        pending: "Signing up...",
        success: {
          render: ({ data }: { data: any }) => {
            router.push("/");
            return `Signup successful!`;
          }
        },
        error: {
          render: ({ data }: { data: { message: string } }) => `${data.message}`
        }
      });
 
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
                Phone
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                  className={getWarningClass("phone")}
                  autoComplete="off"
                />
              </label>
              <label>
                Department
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Business"
                  className={getWarningClass("department")}
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
