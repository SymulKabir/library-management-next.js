const mysql = require("mysql2/promise");

const db = async () => {
  return mysql.createConnection({
    host: "localhost",
    user: "book_hive",
    password: "12345",
    database: "library_management",
  });
};

// Drop all tables safely
const dropAllTables = async () => {
  const conn = await db();
  await conn.execute("SET FOREIGN_KEY_CHECKS = 0");
  await conn.execute("DROP TABLE IF EXISTS issue_records");
  await conn.execute("DROP TABLE IF EXISTS students");
  await conn.execute("DROP TABLE IF EXISTS books");
  await conn.execute("DROP TABLE IF EXISTS admins");
  await conn.execute("SET FOREIGN_KEY_CHECKS = 1");
  await conn.end();
};

// Initialize tables
const initStudentDB = async () => {
  const conn = await db();
  await conn.execute(`
    CREATE TABLE students (
      student_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      department VARCHAR(150) NOT NULL,
      phone VARCHAR(150) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await conn.end();
  console.log("Students table initialized.");
};

const initBooksDB = async () => {
  const conn = await db();
  await conn.execute(`
    CREATE TABLE books (
      book_id VARCHAR(100) NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(150) NOT NULL,
      category VARCHAR(100) NOT NULL,
      availability BOOLEAN NOT NULL DEFAULT TRUE,
      image_url VARCHAR(255),
      stock INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await conn.end();
  console.log("Books table initialized.");
};

const initAdminsDB = async () => {
  const conn = await db();
  await conn.execute(`
    CREATE TABLE admins (
      admin_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      role VARCHAR(150) NOT NULL,
      status ENUM('Pending','Approved','Rejected','Ban') NOT NULL DEFAULT 'Pending',
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await conn.end();
  console.log("Admins table initialized.");
};

const initIssueRecordsDB = async () => {
  const conn = await db();
  await conn.execute(`
    CREATE TABLE issue_records (
      issue_id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      admin_id INT,
      book_id VARCHAR(100) NOT NULL,
      issue_date DATE NOT NULL,
      return_date DATE,
      status ENUM('Pending','Issued','Rejected','Returned') NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
      FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
    )
  `);
  await conn.end();
  console.log("Issue Records table initialized.");
};

const init = async () => {
  await dropAllTables();
  await initStudentDB();
  await initBooksDB();
  await initAdminsDB();
  await initIssueRecordsDB();
};

init();
