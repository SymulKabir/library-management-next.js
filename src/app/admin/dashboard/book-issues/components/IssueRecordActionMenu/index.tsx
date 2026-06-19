"use client";
import React from "react";
import { SlClose } from "react-icons/sl";
import { FaRegCheckCircle } from "react-icons/fa";
import "./styles.scss";
import { CiBookmarkCheck } from "react-icons/ci";
import { GiMoneyStack } from "react-icons/gi";

interface Props {
  modalData: any;
  updateIssueStatus: (fn: any) => void;
  openFineModal: (fn: any) => void;
}

const IssueRecordActionMenu = ({
  modalData,
  updateIssueStatus,
  openFineModal,
}: Props) => {
  const isDisabled = (status: string) => {
    return modalData.status === status;
  };

  return (
    <div className="action-book-menu">
      <button
        disabled={isDisabled("Issued")}
        onClick={() =>
          updateIssueStatus({
            ...modalData,
            updateStatus: "Issued",
          })
        }
      >
        <FaRegCheckCircle /> Issue
      </button>
      <button
        disabled={isDisabled("Rejected")}
        onClick={() =>
          updateIssueStatus({
            ...modalData,
            updateStatus: "Rejected",
          })
        }
      >
        <SlClose /> Reject
      </button>
      <button
        disabled={isDisabled("Returned")}
        onClick={() =>
          updateIssueStatus({
            ...modalData,
            updateStatus: "Returned",
          })
        }
      >
        <CiBookmarkCheck /> Return
      </button>
      <button
        disabled={isDisabled("Fine")}
        onClick={() =>
          openFineModal({
            ...modalData,
            updateStatus: "Fine",
          })
        }
      >
        <GiMoneyStack /> Fine
      </button>
    </div>
  );
};

export default IssueRecordActionMenu;
