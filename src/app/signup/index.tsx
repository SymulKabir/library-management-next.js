"use client";
import { useEffect, useState } from "react";
import "./styles.scss";
import { promiseToast, warningToast } from "@/src/utils/toast";
import Link from "next/link"; 
import { IoRocket } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FaCamera } from "react-icons/fa";
import useFaceAuth from "@/src/hooks/useFaceAuth";
const Signup = () => {
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    department: "",
    role: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [processing, setProcessing] = useState({
    signup: false,
  });
  const [warnings, setWarnings] = useState<Record<string, boolean>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { openModal: openAuthModal, modal: FaceAuthModal } = useFaceAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const faceId = searchParams.get("faceId");

  useEffect(() => {
    setForm((state: any) => {
      const newState: typeof state = {} as typeof state;
      Object.keys(state).forEach((key) => {
        newState[key as keyof typeof state] = "";
      });
      return newState;
    });
  }, [isAdmin]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    const newWarnings: Record<string, boolean> = {};

    // Shared validation
    const sharedRequired = ["name", "email", "password", "confirmPassword"];

    // Student-only fields
    const studentRequired = ["phone", "department"];

    // Admin-only fields
    const adminRequired = ["role"];

    // Build required fields dynamically
    let requiredFields = [...sharedRequired];

    if (isAdmin) {
      requiredFields = [...requiredFields, ...adminRequired];
    } else {
      requiredFields = [...requiredFields, ...studentRequired];
    }

    // Check empty fields
    requiredFields.forEach((field) => {
      if (!form[field as keyof typeof form]) {
        newWarnings[field] = true;
      }
    });

    if (Object.keys(newWarnings).length > 0) {
      warningToast("Fill all required fields!");
      setWarnings(newWarnings);
      return false;
    }

    // Student-only phone validation
    if (!isAdmin && phoneRegex.test(form.phone) === false) {
      newWarnings["phone"] = true;
      warningToast("Phone number is not valid!");
      setWarnings(newWarnings);
      return false;
    }

    // Password match
    if (form.password !== form.confirmPassword) {
      newWarnings["confirmPassword"] = true;
      warningToast("Passwords do not match!");
      setWarnings(newWarnings);
      return false;
    }

    // Clear warnings if all good
    setWarnings({});
    return true;
  };

  const apiCall = async () => {
    try {
      setProcessing((state) => {
        return {
          ...state,
          signup: true,
        };
      });
      const apiRoute = isAdmin ? "/api/admin" : "/api/students";
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, faceId: faceId || null }),
      });

      const { data, message } = await response.json();
      if (!data) {
        throw new Error(message || "Signup failed");
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Signup failed");
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
        success: "Signup successful!",
        error: "Signup failed.",
      });
      // const result = await promiseToast(apiCall(), {
      //   pending: "Signing up...",
      //   success: {
      //     render: ({ data }: { data: any }) => {
      //       router.push("/");
      //       return `Signup successful!`;
      //     },
      //   },
      //   error: {
      //     render: ({ data }: { data: { message: string } }) =>
      //       `${data.message}`,
      //   },
      // });
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const getWarningClass = (field: string) => {
    return warnings[field] ? "warning" : "";
  };

  const showField = (field: string) => {
    const accessList: Record<string, { student: boolean; admin: boolean }> = {
      name: { student: true, admin: true },
      email: { student: true, admin: true },
      phone: { student: true, admin: false },
      department: { student: true, admin: false },
      role: { student: false, admin: true },
    };

    if (!accessList[field]) return true; // default to true if not defined

    return isAdmin ? accessList[field].admin : accessList[field].student;
  };

  return (
    <>
      <div className="container ">
        <div className="auth-page">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Signup</h2>
            </div>
            {faceId && (
              <div className="face-verification-banner">
                <div className="status-badge">
                  <span className="icon">✓</span>
                  <span>Identity Verified</span>
                </div>
                <p>
                  Your biometric profile is ready. Please complete your account
                  details to finalize the link.
                </p>
                <input type="hidden" name="faceId" value={form.faceId} />
              </div>
            )}
            <form onSubmit={handleSubmit} autoComplete="off">
              {showField("name") && (
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
              )}
              {showField("email") && (
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
              )}

              {showField("phone") && (
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
              )}
              {showField("department") && (
                <label>
                  Department
                  <select
                    name="department"
                    value={form.department}
                    onChange={(e) => handleChange(e)}
                    className={getWarningClass("department")}
                    autoComplete="off"
                  >
                    <option value="" hidden>
                      Select Department
                    </option>
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="BBA">BBA</option>
                    <option value="ENG">ENG</option>
                    <option value="LAW">LAW</option>
                    <option value="ARCH">ARCH</option>
                  </select>
                </label>
              )}
              {showField("role") && (
                <label>
                  Role
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={getWarningClass("role")}
                  >
                    <option value="" hidden>
                      Select Role
                    </option>
                    <option value="librarian">Librarian</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              )}
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
              {!faceId && (
                <label className="checkbox">
                  Signup As Admin
                  <input
                    type="checkbox"
                    onChange={() => setIsAdmin((condition) => !condition)}
                    checked={isAdmin}
                    autoComplete="off"
                  />
                </label>
              )}
              <button type="submit" disabled={processing.signup}>
                <IoRocket />
                {faceId ? "Complete Sign Up" : "Sign Up"}
              </button>
              {!faceId && (
                <>
                  <div className="divider">
                    <span>OR</span>
                  </div>
                  <button
                    type="button"
                    className="quick-login-btn"
                    onClick={openAuthModal}
                  >
                    <FaCamera /> Quick Login with Face
                  </button>
                </>
              )}
              <div className="nav">
                <p>Already have an account?</p>
                <Link href={"/signin"}>Sing In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FaceAuthModal />{" "}
    </>
  );
};

export default Signup;
