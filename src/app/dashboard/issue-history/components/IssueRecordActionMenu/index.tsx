"use client";
import React, { useState } from "react";
import { SlClose, SlWallet } from "react-icons/sl";
import "./styles.scss";
import { promiseToast } from "@/src/utils/toast";

interface Props {
  issue_id: string;
  currentStatus: string;
  disablePayFine: boolean;
  setBookIssuers: (fn: any) => void;
  setFineData: (fn: any) => void;
}

const IssueRecordActionMenu = ({
  issue_id,
  currentStatus,
  disablePayFine,
  setBookIssuers,
  setFineData
}: Props) => {
  const [processing, setProcessing] = useState({ loading: false });

  const apiCall = async (status: string) => {
    setProcessing({ loading: true });
    if (isDisabled(status)) {
      throw new Error("Status is already set to the selected value");
      return null;
    }
    try {
      const response = await fetch("/api/issue-records/update-student-status", {
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
  const isDisabled = (status:string) => {
    if (currentStatus === status) {
      
    }
    return currentStatus === status || currentStatus !== "Pending";
  };

  return (
    <div className="action-book-menu">
      <button
        disabled={isDisabled("Canaled")}
        onClick={() => updateIssueStatus("Canaled")}
      >
        <SlClose /> Canaled
      </button>
      <button
        disabled={currentStatus !== "Fine" || disablePayFine}
        onClick={() => setFineData(issue_id)}
      >
        <SlWallet /> Pay Fine
      </button>
    </div>
  );
};

export default IssueRecordActionMenu;
