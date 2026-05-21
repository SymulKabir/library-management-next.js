"use client";
import React, { useState } from "react";
import { SlClose } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";
import "./styles.scss";
import { promiseToast } from "@/shared/utils/toast";
import { FaBan } from "react-icons/fa";
import useAdmin from '@/shared/hooks/useAdmin'

interface Props {
  admin_id: string;
  currentStatus: string;
  setAdmins: (fn: any) => void;
}

const IssueRecordActionMenu = ({
  admin_id,
  currentStatus,
  setAdmins,
}: Props) => {
  const [processing, setProcessing] = useState({ loading: false });
  const adminState = useAdmin()
  const admin = adminState.data

  const apiCall = async (status: string) => {
    setProcessing({ loading: true });
    if (status === currentStatus) {
      throw new Error("Status is already set to the selected value");
      return null;
    }
    try {
      const response = await fetch("/api/admin/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id, status }),
      });

      const { success, message } = await response.json();
      if (!success) throw new Error(message || "Failed to update status");

      setAdmins((state: any[]) =>
        state.map((b) => {
          if (b?.admin_id === admin_id) {
            b["status"] = status;
          }
          return { ...b };
        })
      );
      return null;
    } catch (err: any) {
      throw new Error(err.message || "Something went wrong");
    } finally {
      setProcessing({ loading: false });
    }
  };

  const updateIssueStatus = async (status: string) => {
    if (processing.loading) return;
    try {
      await promiseToast(apiCall(status), {
        pending: `Updating ${admin_id}...`,
        success: {
          render: () =>
            `Book issue request ID:${admin_id} updated successfully!`,
        },
        error: {
          render: ({ data }: { data: Error }) => data.message,
        },
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const isDisabled = (status: string) => {
    if (admin?.admin_id === admin_id) return true
    return currentStatus === status;
  };

  return (
    <div className="action-book-menu">
      <button
        disabled={isDisabled("Approved")}
        onClick={() => updateIssueStatus("Approved")}
      >
        <FaRegCheckCircle /> Approved
      </button>
      <button
        disabled={isDisabled("Rejected")}
        onClick={() => updateIssueStatus("Rejected")}
      >
        <SlClose /> Rejected
      </button>
      <button
        disabled={isDisabled("Ban")}
        onClick={() => updateIssueStatus("Ban")}
      >
        <FaBan /> Ban
      </button>
    </div>
  );
};

export default IssueRecordActionMenu;
