/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import DashboardLayout from "@/src/layouts/DashboardLayout/index";
import { IoIosArrowDown } from "react-icons/io";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import IssueRecordActionMenu from "./components/IssueRecordActionMenu/index";
import { LuSettings2 } from "react-icons/lu";
import CustomSelect from "@/src/components/CustomSelect/index";
import FineModal from "@/src/components/Modal/FineModal";
import { promiseToast } from "@/src/utils/toast";
import { adminHeader } from "@/src/utils/header";

const statuses = ["Pending", "Canaled", "Issued", "Rejected", "Returned"];
const sortBy = {
  asc: "Oldest",
  desc: "Newest",
};
const BookIssuer = () => {
  const [bookIssuers, setBookIssuers] = useState<any[]>([]);
  const [filterInputs, setFilterInputs] = useState({});
  const [fineModalData, setFineModalData] = useState(null);
  const [processing, setProcessing] = useState({ loading: false });

  const fetchIssueRecords = async () => {
    try {
      const res = await fetch("/api/issue-records/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterInputs),
      });

      const { data } = await res.json();
      setBookIssuers(data || []);
    } catch (error) {
      console.error("Error fetching issue records:", error);
    }
  };

  useEffect(() => {
    fetchIssueRecords();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  const handleFilter = () => {
    // Implement filter logic here if needed
    fetchIssueRecords();
  };
  const changeFIlter = (e) => {
    const { name, value } = e.target;
    setFilterInputs((prev) => ({ ...prev, [name]: value }));
  };
  const getFilteredData = (name) => {
    return filterInputs[name] || "";
  };

  const closeFineModal = () => {
    setFineModalData(null);
  };

  const apiCall = async ({
    issue_id,
    status,
    updateStatus,
    fineAmount,
    fineReason,
  }: any) => {
    setProcessing({ loading: true });
    if (updateStatus === status) {
      throw new Error("Status is already set to the selected value");
      return null;
    }
    try {
      const response = await fetch("/api/issue-records/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...adminHeader() },
        body: JSON.stringify({
          issue_id,
          status: updateStatus,
          fineAmount,
          fineReason,
        }),
      });

      const { success, message } = await response.json();
      if (!success) throw new Error(message || "Failed to update status");

      setBookIssuers((state: any[]) =>
        state.map((b) => {
          if (b.issue_id === issue_id) {
            b["status"] = updateStatus;
          }
          return { ...b };
        }),
      );
      return null;
    } catch (err: any) {
      throw new Error(err.message || "Something went wrong");
    } finally {
      setProcessing({ loading: false });
    }
  };

  const updateIssueStatus = async (data: any) => {
    if (processing.loading) return;
    try {
      await promiseToast(
        apiCall({
          issue_id: data.issue_id,
          status: data.status,
          updateStatus: data.updateStatus,
          fineAmount: data.fineAmount,
          fineReason: data.fineReason,
        }),
        {
          pending: `Updating ${data.issue_id}...`,
          success: {
            render: () =>
              `Book issue request ID:${data.issue_id} updated successfully!`,
          },
          error: {
            render: ({ data }: { data: Error }) => data.message,
          },
        },
      );
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const handleFineModalSubmit = (data) => {
    updateIssueStatus({
      ...data,
      updateStatus: "Fine",
    });
  };

  return (
    <DashboardLayout>
      <div className="admin-book-issuer">
        <section className="header">
          <h2>Book Issue Records</h2>
        </section>
        <section className="filter-controls">
          <div className="search">
            <input
              type="input"
              placeholder="search by book"
              name="search"
              value={getFilteredData("search")}
              onChange={changeFIlter}
            />
          </div>
          <div className="select">
            <label>Status:</label>
            <CustomSelect
              name="status"
              value={getFilteredData("status")}
              onChange={changeFIlter}
            >
              <option value="">All</option>
              {!!statuses?.length &&
                statuses?.map((status, i) => (
                  <option key={i} value={status}>
                    {status}
                  </option>
                ))}
            </CustomSelect>
          </div>
          <div className="select">
            <label>Sort By:</label>
            <CustomSelect
              name="sort"
              value={sortBy[getFilteredData("sort")]}
              onChange={changeFIlter}
            >
              {Object.keys(sortBy).map((key, index) => {
                return (
                  <option key={index} value={key}>
                    {sortBy[key]}
                  </option>
                );
              })}
            </CustomSelect>
          </div>
          <div className="button">
            <button onClick={handleFilter}>
              Filter <LuSettings2 />
            </button>
          </div>
        </section>
        <section className="table-controls">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Issue ID</th>
                <th>Student ID</th>
                <th>Student</th>
                <th>Book</th>
                <th>Issued On</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookIssuers.length > 0 &&
                bookIssuers.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" />
                    </td>

                    <td>{item.issue_id}</td>

                    <td>{item.student_id}</td>
                    <td>{item.student_name}</td>

                    <td>
                      {item.book_title}
                      <br />
                      <small>{item.book_id}</small>
                    </td>

                    <td>{formatDate(item.issue_date)}</td>

                    <td>{formatDate(item.return_date)}</td>

                    <td className={item.status.toLowerCase()}>
                      <p>{capitalize(item.status)}</p>
                    </td>

                    <td className="action-container">
                      <div>
                        <button>
                          <IoIosArrowDown />
                        </button>
                        <button>
                          <PiDotsThreeOutlineVerticalDuotone />
                          <IssueRecordActionMenu
                            modalData={item}
                            updateIssueStatus={updateIssueStatus}
                            openFineModal={setFineModalData}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {bookIssuers.length === 0 && <p>No issue records found.</p>}
        </section>
      </div>
      <FineModal
        modalData={fineModalData}
        setModalData={setFineModalData}
        handleClose={closeFineModal}
        onSubmit={handleFineModalSubmit}
      />
    </DashboardLayout>
  );
};

export default BookIssuer;
