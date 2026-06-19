"use client";
import React, { useState } from "react";
import { SlClose } from "react-icons/sl";
import "./styles.scss";

// Custom BDT (৳) Icon matching the clean aesthetic
const BdtIcon = ({ size = 16, className = "" }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height={size}
    width={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 4v2h3.14c.45 0 .86.28.97.71l.41 1.63A4.001 4.001 0 0 0 8 12v2c0 1.66 1.34 3 3 3h1v3h2v-3h1v-2h-4c-.55 0-1-.45-1-1v-2c0-1.1.9-2 2-2h3V7c0-1.66-1.34-3-3-3H7zm7 5h2v2h-2V9z"></path>
  </svg>
);

interface FineModalProps {
  modalData: any;
  handleClose: () => void;
  setModalData: (data: any) => void;
  onSubmit: (data: any) => void;
  processing: boolean;
}

const FineModal = ({
  modalData,
  handleClose,
  onSubmit,
  setModalData,
  processing,
}: FineModalProps) => {
  if (!modalData || !modalData.status) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData.fineAmount || !modalData.fineReason) {
      alert("Please fill in all required fields.");
      return;
    }
    onSubmit({ ...modalData });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setModalData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  return (
    <div className="fine-modal-overlay" onClick={handleClose}>
      <div className="fine-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Area */}
        <div className="fine-modal-header">
          <div className="title-area">
            <div className="icon-badge">
              <BdtIcon size={18} />
            </div>
            <div className="title-meta">
              <h3>ISSUE FINE</h3>

              <p>
                for Book:{" "}
                <span className="highlight">{modalData.book_title}</span>
              </p>
              <p>
                Borrower:{" "}
                <span className="highlight">{modalData.student_name}</span> (ID:{" "}
                {modalData.issue_id})
              </p>
            </div>
          </div>
          <button
            className="close-x-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <SlClose />
          </button>
        </div>

        {/* Input Forms Body */}
        <form onSubmit={handleSubmit}>
          <div className="fine-modal-body">
            {/* Fine Amount Row */}
            <div className="fine-input-group">
              <label htmlFor="fine-amount">Fine Amount</label>
              <div className="input-with-addon">
                <span className="addon-currency">
                  <BdtIcon size={14} />
                </span>
                <input
                  id="fine-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  name="fineAmount"
                  value={modalData.fineAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Reason Row */}
            <div className="fine-input-group">
              <label htmlFor="fine-reason">Reason for Fine</label>
              <input
                id="fine-reason"
                type="text"
                name="fineReason"
                value={modalData.fineReason}
                onChange={handleInputChange}
                placeholder="Reason for Fine"
                required
              />
            </div>

            {/* Additional Notes Row */}
            <div className="fine-input-group">
              <label htmlFor="fine-notes">Additional Notes</label>
              <textarea
                id="fine-notes"
                // name="fineReason"
                // value={modalData.fineReason}
                // onChange={handleInputChange}
                // value={fineData.notes}
                // onChange={(e) =>
                //   setFineData({ ...fineData, notes: e.target.value })
                // }
                placeholder="Additional Notes"
                rows={3}
              />
            </div>
          </div>

          {/* Action Footer Button Triggers */}
          <div className="fine-modal-footer">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={processing}>
              {processing ? "Processing..." : "Confirm Fine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FineModal;
