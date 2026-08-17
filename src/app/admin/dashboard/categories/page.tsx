"use client";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import DashboardLayout from "@/src/layouts/DashboardLayout/index";
import { MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">(
    "categories",
  );

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);

  // Form states
  const [categoryInput, setCategoryInput] = useState({
    category_name: "",
    description: "",
    category_image: "",
  });
  const [subcategoryInput, setSubcategoryInput] = useState({
    category_name: "",
    subcategory_name: "",
    description: "",
    subcategory_image: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      setCategories(catData.data || []);

      const subRes = await fetch("/api/subcategories");
      const subData = await subRes.json();
      setSubcategories(subData.data || []);
    } catch (error:any) {
      console.error("Error fetching category data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Category Submit (Add & Update)
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingId
      ? `/api/categories/update`
      : `/api/categories/add`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...categoryInput, category_id: editingId }),
      });
      if (res.ok) {
        setCategoryInput({
          category_name: "",
          description: "",
          category_image: "",
        });
        setEditingId(null);
        setIsCategoryModalOpen(false);
        fetchData();
      }
    } catch (error:any) {
      console.error("Error saving category:", error);
    }
  };

  // Handle Subcategory Submit (Add)
  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/subcategories/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subcategoryInput),
      });
      if (res.ok) {
        setSubcategoryInput({
          category_name: "",
          subcategory_name: "",
          description: "",
          subcategory_image: "",
        });
        setIsSubcategoryModalOpen(false);
        fetchData();
      }
    } catch (error:any) {
      console.error("Error saving subcategory:", error);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure? This will affect related items.")) return;
    try {
      const res = await fetch("/api/categories/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id: id }),
      });
      if (res.ok) fetchData();
    } catch (error:any) {
      console.error("Error deleting category:", error);
    }
  };

  // Handle Delete Subcategory
  const handleDeleteSubcategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      const res = await fetch("/api/subcategories/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subcategory_id: id }),
      });
      if (res.ok) fetchData();
    } catch (error:any) {
      console.error("Error deleting subcategory:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-categories">
        <div className="header-actions">
          <div className="tabs">
            <button
              className={activeTab === "categories" ? "active" : ""}
              onClick={() => setActiveTab("categories")}
            >
              Manage Categories
            </button>
            <button
              className={activeTab === "subcategories" ? "active" : ""}
              onClick={() => setActiveTab("subcategories")}
            >
              Manage Subcategories
            </button>
          </div>

          <div className="action-button">
            {activeTab === "categories" ? (
              <button
                onClick={() => {
                  setEditingId(null);
                  setCategoryInput({
                    category_name: "",
                    description: "",
                    category_image: "",
                  });
                  setIsCategoryModalOpen(true);
                }}
              >
                Add Category <MdAdd />
              </button>
            ) : (
              <button
                onClick={() => {
                  setSubcategoryInput({
                    category_name: "",
                    subcategory_name: "",
                    description: "",
                    subcategory_image: "",
                  });
                  setIsSubcategoryModalOpen(true);
                }}
              >
                Add Subcategory <MdAdd />
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Content */}
        {activeTab === "categories" ? (
          <div className="table-controls">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat.category_id || idx}>
                    <td>{idx + 1}</td>
                    <td className="img-container">
                      <div>
                        {cat.category_image ? (
                          <img src={cat.category_image} alt="" />
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                    </td>
                    <td>{cat.category_name}</td>
                    <td>{cat.description || "N/A"}</td>
                    <td className="action-container">
                      <button
                        onClick={() => {
                          setEditingId(cat.category_id);
                          setCategoryInput({
                            category_name: cat.category_name,
                            description: cat.description || "",
                            category_image: cat.category_image || "",
                          });
                          setIsCategoryModalOpen(true);
                        }}
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.category_id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Subcategories Tab Content */
          <div className="table-controls">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Parent Category</th>
                  <th>Subcategory Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((sub, idx) => (
                  <tr key={sub.subcategory_id || idx}>
                    <td>{idx + 1}</td>
                    <td className="img-container">
                      <div>
                        {sub.subcategory_image ? (
                          <img
                            src={sub.subcategory_image}
                            alt={sub.subcategory_name}
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                    </td>
                    <td>{sub.category_name}</td>
                    <td>{sub.subcategory_name}</td>
                    <td>{sub.description || "N/A"}</td>
                    <td className="action-container">
                      <button
                        onClick={() =>
                          handleDeleteSubcategory(sub.subcategory_id)
                        }
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Category Modal (Add / Edit) */}
        {isCategoryModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingId ? "Edit Category" : "Add New Category"}</h3>
                <button onClick={() => setIsCategoryModalOpen(false)}>
                  <MdClose />
                </button>
              </div>
              <form onSubmit={handleCategorySubmit} className="entry-form">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={categoryInput.category_name}
                  onChange={(e) =>
                    setCategoryInput({
                      ...categoryInput,
                      category_name: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={categoryInput.category_image}
                  onChange={(e) =>
                    setCategoryInput({
                      ...categoryInput,
                      category_image: e.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="Description"
                  value={categoryInput.description}
                  onChange={(e) =>
                    setCategoryInput({
                      ...categoryInput,
                      description: e.target.value,
                    })
                  }
                />
                <button type="submit">
                  {editingId ? "Update Category" : "Save Category"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Subcategory Modal (Add) */}
        {isSubcategoryModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add New Subcategory</h3>
                <button onClick={() => setIsSubcategoryModalOpen(false)}>
                  <MdClose />
                </button>
              </div>
              <form onSubmit={handleSubcategorySubmit} className="entry-form">
                <select
                  value={subcategoryInput.category_name}
                  onChange={(e) =>
                    setSubcategoryInput({
                      ...subcategoryInput,
                      category_name: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.category_name}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  value={subcategoryInput.subcategory_name}
                  onChange={(e) =>
                    setSubcategoryInput({
                      ...subcategoryInput,
                      subcategory_name: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={subcategoryInput.subcategory_image}
                  onChange={(e) =>
                    setSubcategoryInput({
                      ...subcategoryInput,
                      subcategory_image: e.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="Description"
                  value={subcategoryInput.description}
                  onChange={(e) =>
                    setSubcategoryInput({
                      ...subcategoryInput,
                      description: e.target.value,
                    })
                  }
                />
                <button type="submit">Save Subcategory</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Categories;
