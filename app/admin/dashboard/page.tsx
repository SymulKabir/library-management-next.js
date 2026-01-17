/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import DashboardLayout from "@/shared/layouts/DashboardLayout/index";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { LuSettings2 } from "react-icons/lu";
import IssueRecordActionMenu from "./Components/IssueRecordActionMenu/index";
import CustomSelect from '@/shared/components/CustomSelect/index'



const statuses = ["Approved", "Rejected", "Ban"];
const sortBy = {
  asc: "Oldest",
  desc: "Newest"
}

const Dashboard = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [filterInputs, setFilterInputs] = useState({});

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterInputs),
      });

      const { data } = await res.json();
      setAdmins(data || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
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

  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  const handleFilter = () => {
    fetchAdmins();
  };

  const changeFilter = (e: any) => {
    const { name, value } = e.target;
    setFilterInputs((prev) => ({ ...prev, [name]: value }));
  };

  const getFilteredData = (name: string) => {
    return filterInputs[name] || "";
  };

  console.log("admins =========>>>>>>>>", admins);
  return (
    <DashboardLayout>
      <div className="admin-book-issuer">
        <section className="header">
          <h2>Admin List</h2>
        </section>

        <section className="filter-controls">
          <div className="search">
            <input
              type="input"
              placeholder="Search by name or email"
              name="search"
              value={getFilteredData("search")}
              onChange={changeFilter}
            />
          </div>

          <div className="custom-select">
            <label>Status:</label>
            <CustomSelect
              name="status"
              value={getFilteredData("status")}
              onChange={changeFilter}
              placeholder={"All"}
            >
              {statuses.map((status, i) => (
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
              onChange={changeFilter}
            >
              {
                Object.keys(sortBy).map((key, index) => {
                  return <option key={index} value={key}>{sortBy[key]}</option>
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
                <th>Admin ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {admins.length > 0 &&
                admins.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" />
                    </td>

                    <td>{item?.admin_id}</td>

                    <td>{item?.name}</td>

                    <td>{item?.email}</td>

                    <td>{item?.role}</td>

                    <td className={item?.status?.toLowerCase()}>
                      <p>{capitalize(item.status)}</p>
                    </td>

                    <td>{formatDate(item?.created_at)}</td>

                    <td className="action-container">
                      <div>
                        <button>
                          <PiDotsThreeOutlineVerticalDuotone />
                          <IssueRecordActionMenu admin_id={item.admin_id} currentStatus={item.status} setAdmins={setAdmins} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {admins.length === 0 && <p>No admins found.</p>}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
