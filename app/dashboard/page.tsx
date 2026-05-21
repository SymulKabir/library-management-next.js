'use client'
import React, { useEffect, useState } from "react";
import './styles.scss';
import DashboardLayout from '@/shared/layouts/DashboardLayout/index';
import useStudent from "@/shared/hooks/useStudent";
import { studentHeader } from "@/shared/utils/header";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const studentState = useStudent()
  const studentInfo = studentState.data || {}

  useEffect(() => {
    fetch(`/api/students/dashboard`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...studentHeader() },

    })
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <p>Loading...</p>;

  const { student, stats, activity } = data;

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">{`Welcome, ${studentInfo.name}`}</h1>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Books Issued</h3>
            <p>{stats.issued_books}</p>
          </div>
          <div className="card">
            <h3>Pending Fines</h3>
            <p>$0</p> {/* Note: You may need a 'fines' column in your schema later */}
          </div>
          <div className="card">
            <h3>Available Books</h3>
            <p>{stats.available_books}</p>
          </div>
          <div className="card">
            <h3>Reservations</h3>
            <p>{stats.pending_reservations}</p>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <section className="table-controls">
            <table>
              <tbody>
                {activity.length > 0 &&
                  activity.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(item.date).toLocaleDateString()}
                      </td>

                      <td>{item.status}</td>
                      <td>{item.title}</td>

                    </tr>
                  ))}
              </tbody>
            </table>

            {activity.length === 0 && <p>No recent activity found</p>}
          </section>
        </div>

        {/* ... Quick Actions remains the same ... */}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;