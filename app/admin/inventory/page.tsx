"use client";
import React from "react";
import "./styles.scss";
import DashboardLayout from "@/shared/layouts/DashboardLayout/index";
import { MdAdd } from "react-icons/md";
import Image from "next/image";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const items = [
    {
      id: 1,
      idNumber: "BK-001",
      name: "The Alchemist",
      author: "Paulo Coelho",
      stock: 12,
    },
    {
      id: 2,
      idNumber: "BK-002",
      name: "Atomic Habits",
      author: "James Clear",
      stock: 8,
    },
    {
      id: 3,
      idNumber: "BK-003",
      name: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      stock: 4,
    },
  ];
  const ImgAdd =
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvZXN8ZW58MHx8MHx8fDA%3D";
  const handleUpdateBookNav = () => {
    router.push("/admin/inventory/add");
  };

  return (
    <DashboardLayout>
      <div className="admin-inventory">
        <section className="inventory-filter-section">
          <div className="select">
            <label>Category:</label>
            <select>
              <option value="cat1">Cat 1</option>
            </select>
          </div>

          <div className="select">
            <label>Author:</label>
            <select>
              <option value="author1">Author 1</option>
            </select>
          </div>

          <div className="select">
            <label>Sort By:</label>
            <select>
              <option value="bestsale">Best Sale</option>
            </select>
          </div>

          <div className="button">
            <button onClick={handleUpdateBookNav}>
              Add items <MdAdd />
            </button>
          </div>
        </section>

        <section className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ID Number</th>
                <th>Name</th>
                <th>Author</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="img-container">
                    <div>
                      <input type="checkbox" />
                      <div>
                        <Image src={ImgAdd} alt="" height={100} width={100} />
                      </div>
                    </div>
                  </td>
                  <td>{item.idNumber}</td>
                  <td>{item.name}</td>
                  <td>{item.author}</td>
                  <td>{item.stock}</td>
                  <td className="action-container">
                    <div>
                      <button>
                        <IoIosArrowDown />
                      </button>
                      <button>
                        <PiDotsThreeOutlineVerticalDuotone />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
