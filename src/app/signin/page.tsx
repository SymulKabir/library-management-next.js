"use client";
import { useState } from "react";
import "./styles.scss";
import Link from "next/link";
import HeaderLayout from "@/src/layouts/HeaderLayout";
import { FaCamera, FaSignInAlt } from "react-icons/fa";
import { promiseToast, warningToast } from "@/src/utils/toast";
import {
  removeAdminToken,
  removeStudentToken,
  setAdminToken,
  setStudentToken,
} from "@/src/utils/cookies";
import {
  removeStudent,
  setStudent,
  updateStudentProgress,
} from "@/src/store/student/reducer";
import { useSelector, useDispatch } from "react-redux";
import { removeAdmin, setAdmin } from "@/src/store/admin/reducer";
import { useRouter } from "next/navigation";
import useFaceAuth from "@/src/hooks/useFaceAuth";

const Signin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [warnings, setWarnings] = useState<Record<string, boolean>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showFaceAuthModal, setShowFaceAuthModal] = useState<boolean>(false);
  const state = useSelector((state) => state);
  const { openModal: openAuthModal, modal: FaceAuthModal } = useFaceAuth();

  const dispatch = useDispatch();
  const router = useRouter();

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
    if (Object.keys(newWarnings).length > 0) {
      warningToast("Fill the form, then try again!");
    }

    return Object.keys(newWarnings).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const apiCall = async () => {
      dispatch(updateStudentProgress(true));

      try {
        const apiRoute = isAdmin ? "/api/admin/signin" : "/api/students/signin";
        const response = await fetch(apiRoute, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const { data, token, message } = await response.json();

        if (!data) {
          throw new Error(message || "Signin failed");
        }
        if (isAdmin) {
          if (token) {
            setAdminToken(token);
            removeStudentToken();
          }
          dispatch(setAdmin(data));
          dispatch(removeStudent());
        } else {
          if (token) {
            setStudentToken(token);
            removeAdminToken();
          }
          dispatch(setStudent(data));
          dispatch(removeAdmin());
        }

        return data;
      } catch (error: any) {
        throw new Error(error.message || "Signin failed");
      } finally {
        dispatch(updateStudentProgress(false));
      }
    };

    try {
      const result = await promiseToast(apiCall(), {
        pending: "Signing in...",
        success: "Signin successful!",
        error: "Signin failed. Please try again.",
      });
      // const result = await promiseToast(apiCall(), {
      //   pending: "Signing in...",
      //   success: "Signin successful!",
      //   error: {
      //     render: ({ data }: { data: Error }) =>
      //       data.message || "Signin failed. Please try again.",
      //   },
      // });

      if (result?.email) {
        router.push(isAdmin ? "/admin/dashboard" : "/dashboard");
      }
    } catch (err) {
      console.error("Signin error:", err);
    }
  };

  const getWarningClass = (field: string) => {
    return warnings[field] ? "warning" : "";
  };

  const handleToggleFaceAuthModal = () => {
    setShowFaceAuthModal(!showFaceAuthModal);
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
              <label className="checkbox">
                Signin As Admin
                <input
                  type="checkbox"
                  onChange={() => setIsAdmin((condition) => !condition)}
                  checked={isAdmin}
                  autoComplete="off"
                />
              </label>
              <button type="submit">
                <FaSignInAlt /> Login
              </button>
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

              <div className="nav">
                <p>Don't have an account?</p>
                <Link href={"/signup"}>Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FaceAuthModal />
    </HeaderLayout>
  );
};

export default Signin;
