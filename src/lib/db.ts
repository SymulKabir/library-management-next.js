import mysql from "mysql2/promise";

export const db = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "book_hive",
    password: process.env.DB_PASSWORD || "12345",
    database: process.env.DB_NAME || "library_management",
  });
};