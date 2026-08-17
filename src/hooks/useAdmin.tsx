"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAdminToken } from "@/src/utils/cookies";
import { removeStudent } from "@/src/store/student/reducer";
import { setAdmin, updateAdminProgress } from "@/src/store/admin/reducer";

const useAdmin = () => {
  const adminState = useSelector((state: any) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    checkAdminLogin();
  }, []);

  const checkAdminLogin = async () => {
    const token = getAdminToken();
    if (!token || adminState?.progressing || adminState?.data) {
      return;
    }
    dispatch(updateAdminProgress(true));
    try {
      const response = await fetch("/api/admin/check-signin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { data, message } = await response.json();
      if (!data) {
        throw new Error(message || "Signin failed");
      }
      dispatch(setAdmin(data));
      dispatch(removeStudent());
    } catch (error: any) {
    } finally {
      dispatch(updateAdminProgress(false));
    }
  };
  return adminState;
};

export default useAdmin;
