/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import DashboardLayout from "@/src/layouts/DashboardLayout/index";
import { IoIosArrowDown } from "react-icons/io";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import IssueRecordActionMenu from "./components/IssueRecordActionMenu/index";
import { LuSettings2 } from "react-icons/lu";
import { studentHeader } from "@/src/utils/header";
import CustomSelect from "@/src/components/CustomSelect/index";
import MakePayment from "@/src/components/MakePayment";

const statuses = [
  "Pending",
  "Canaled",
  "Issued",
  "Rejected",
  "Returned",
  "Fine",
];

const SORT_BY: Record<string, string> = {
  asc: "Oldest",
  desc: "Newest",
};

const IssueHistory = () => {
  const [bookIssuers, setBookIssuers] = useState<any[]>([]);
  const [filterInputs, setFilterInputs] = useState<any>({});
  const [reloadData, setReloadData] = useState<boolean>(false);
  const [makePaymentModalData, setMakePaymentModalData] = useState<{
    amount: numer;
    title: strinbg;
    issue_id: string;
  } | null>(null);

  const fetchIssueRecords = async () => {
    try {
      const res = await fetch("/api/issue-records/student-records", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...studentHeader() },
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
  }, [reloadData]);

  // useEffect(() => {
  //   if (!makePaymentModalData) {
  //     return
  //   }
  //   (async() => {
  //     const res = await fetch("/api/make-payment", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", ...studentHeader() },
  //       body: JSON.stringify(makePaymentModalData),
  //     });

  //     const { data } = await res.json();
  //   })()
  // }, [makePaymentModalData])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);
  const handleFilter = () => {
    // Implement filter logic here if needed
    fetchIssueRecords();
  };
  const changeFIlter = (e: any) => {
    const { name, value } = e.target;
    setFilterInputs((prev: any) => ({ ...prev, [name]: value }));
  };
  const getFilteredData = (name: string) => {
    return filterInputs[name] || "";
  };
  const closeMakePaymentModal = ({ reloadData }: any) => {
    setMakePaymentModalData(null);
    if (reloadData) {
      setReloadData((pre) => !pre);
    }
  };
  const setFineData = async (issue_id: string) => {
    console.log("issue_id -->", issue_id);
    bookIssuers.forEach((item) => {
      console.log("forEach item ===>>", item);
    });
    const findInfo = await bookIssuers.find(
      (item) => item.issue_id === issue_id,
    );
    console.log("filterInputs --->>>", filterInputs);
    console.log("findInfo --->>>", findInfo);
    if (!findInfo) return;
    setMakePaymentModalData({
      amount: Number(findInfo.fine_amount),
      title: findInfo.book_title,
      issue_id: findInfo.issue_id,
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
              value={SORT_BY[getFilteredData("sort")]}
              onChange={changeFIlter}
            >
              {Object.keys(SORT_BY).map((key, index) => {
                return (
                  <option key={index} value={key}>
                    {SORT_BY[key]}
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
                <th>Fine Amount</th>
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
                    <td>
                      {item.fine_amount ? `$${item.fine_amount}` : "None"}
                      <br />
                      {item.fine_amount && item.payment_status && (
                        <small>({item.payment_status})</small>
                      )}
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
                            issue_id={item.issue_id}
                            currentStatus={item.status}
                            setBookIssuers={setBookIssuers}
                            setFineData={setFineData}
                            disablePayFine={item.fine_amount && item.payment_status}
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
      <MakePayment
        modalData={makePaymentModalData}
        closeModal={closeMakePaymentModal}
      />
    </DashboardLayout>
  );
};

export default IssueHistory;
