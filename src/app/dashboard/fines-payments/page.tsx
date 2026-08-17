/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import DashboardLayout from "@/src/layouts/DashboardLayout/index";
import { studentHeader } from "@/src/utils/header";
import MakePayment from "@/src/components/MakePayment";

const IssueHistory = () => {
  const [bookIssuers, setBookIssuers] = useState<any[]>([]);
  const [filterInputs, setFilterInputs] = useState<any>({});
  const [reloadData, setReloadData] = useState<boolean>(false);
  const [makePaymentModalData, setMakePaymentModalData] = useState<any>(null);

  const fetchIssueRecords = async () => {
    try {
      // Connects to the fines API route
      const res = await fetch("/api/issue-records/fines-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...studentHeader() },
        body: JSON.stringify(filterInputs),
      });

      const { data } = await res.json();
      setBookIssuers(data || []);
    } catch (error:any) {
      console.error("Error fetching fines:", error);
    }
  };

  useEffect(() => {
    fetchIssueRecords();
  }, [reloadData, filterInputs]);

  const formatDate = (dateStr: string | null) => (!dateStr ? "N/A" : new Date(dateStr).toLocaleDateString());
  const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
  
  const changeFilter = (e: any) => {
    const { name, value } = e.target;
    setFilterInputs((prev: any) => ({ ...prev, [name]: value }));
  };

  const setFineData = (issue_id: string) => {
    const findInfo = bookIssuers.find((item) => item.issue_id === issue_id);
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
          <h2>Fines And Payments</h2>
        </section>

 

        <section className="table-controls">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Fine Amount</th>
                <th>Status</th>  
              </tr>
            </thead>
            <tbody>
              {bookIssuers.map((item, index) => (
                <tr key={index}>
                  <td>{item.book_title}</td>
                  <td>
                    {item.fine_amount ? `$${item.fine_amount}` : "None"}
                    <br />
                    {item.payment_status && <small>({item.payment_status})</small>}
                  </td>
                  <td className={item.status.toLowerCase()}>{capitalize(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <MakePayment 
        modalData={makePaymentModalData} 
        closeModal={() => setMakePaymentModalData(null)} 
      />
    </DashboardLayout>
  );
};

export default IssueHistory;