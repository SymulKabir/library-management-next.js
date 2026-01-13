"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAdminToken } from "../utils/cookies";
import { removeStudent } from "../store/student/reducer";
import {  setAdmin, updateAdminProgress } from "../store/admin/reducer";

const useAdmin = () => {
  const adminState = useSelector((state) => state.admin);
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
      const { data } = await response.json();
      console.log("check signin data ----->>", data);
      if (!data) {
        throw new Error(message || "Signin failed");
      }
      dispatch(setAdmin(data));
      dispatch(removeStudent());
    } catch (error) {
    } finally {
      dispatch(updateAdminProgress(false));
    }
  };
  return adminState;
};

export default useAdmin;
