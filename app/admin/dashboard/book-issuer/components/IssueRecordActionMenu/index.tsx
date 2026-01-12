"use client";
import React, { useState } from "react";
import { SlClose } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";
import "./styles.scss";
import { promiseToast } from "@/shared/utils/toast";
import { CiBookmarkCheck } from "react-icons/ci";


interface Props {
  issue_id: string;
  currentStatus: string;
  setBookIssuers: (fn: any) => void;
}

const IssueRecordActionMenu = ({
  issue_id,
  currentStatus,
  setBookIssuers,
}: Props) => {
  const [processing, setProcessing] = useState({ loading: false });

  const apiCall = async (status: string) => {
    setProcessing({ loading: true });
    if (status === currentStatus) {
      throw new Error("Status is already set to the selected value");
      return null;
    }
    try {
      const response = await fetch("/api/issue-records/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue_id, status }),
      });

      const { success, message } = await response.json();
      if (!success) throw new Error(message || "Failed to update status");

      setBookIssuers((state: any[]) =>
        state.map((b) => {
          if (b.issue_id === issue_id) {
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
        pending: `Updating ${issue_id}...`,
        success: {
          render: () =>
            `Book issue request ID:${issue_id} updated successfully!`,
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
    return currentStatus === status;
  };

  return (
    <div className="action-book-menu">
      <button
        disabled={isDisabled("Issued")}
        onClick={() => updateIssueStatus("Issued")}
      >
        <FaRegCheckCircle /> Issue
      </button>
      <button
        disabled={isDisabled("Rejected")}
        onClick={() => updateIssueStatus("Rejected")}
      >
        <SlClose /> Reject
      </button>
      <button 
        disabled={isDisabled("Returned")}
        onClick={() => updateIssueStatus("Returned")}
      >
        <CiBookmarkCheck /> Return
      </button>
    </div>
  );
};

export default IssueRecordActionMenu;
