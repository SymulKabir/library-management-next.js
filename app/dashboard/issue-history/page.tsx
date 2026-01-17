/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import DashboardLayout from "@/shared/layouts/DashboardLayout/index";
import { IoIosArrowDown } from "react-icons/io";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import IssueRecordActionMenu from "./components/IssueRecordActionMenu/index";
import { LuSettings2 } from "react-icons/lu";
import { studentHeader } from "@/shared/utils/header";
import CustomSelect from '@/shared/components/CustomSelect/index';
const statuses = ["Pending", "Canaled", "Issued", "Rejected", "Returned"];

const SORT_BY : Record<string, string> = {
  asc: "Oldest",
  desc: "Newest"
}

const IssueHistory = () => {
  const [bookIssuers, setBookIssuers] = useState<any[]>([]);
  const [filterInputs, setFilterInputs] = useState({});

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
              {
                Object.keys(SORT_BY).map((key, index) => {
                  return <option key={index} value={key}>{SORT_BY[key]}</option>
                })
              }
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
                            issue_id={item.issue_id}
                            currentStatus={item.status}
                            setBookIssuers={setBookIssuers}
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
    </DashboardLayout>
  );
};

export default IssueHistory;
