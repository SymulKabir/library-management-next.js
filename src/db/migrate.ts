import { db } from "@/src/lib/db";
import { deleteAllBookVector } from "@/src/services/book";

// Drop all tables safely
const dropAllTables = async () => {
  const conn = await db();
  await conn.execute("SET FOREIGN_KEY_CHECKS = 0");
  await conn.execute("DROP TABLE IF EXISTS issue_records");
  await conn.execute("DROP TABLE IF EXISTS issue_record_fines");
  await conn.execute("DROP TABLE IF EXISTS issue_record_fine_payments"); // Drop payment table first
  await conn.execute("DROP TABLE IF EXISTS students");
  await conn.execute("DROP TABLE IF EXISTS books");
  await conn.execute("DROP TABLE IF EXISTS admins");
  await conn.execute("SET FOREIGN_KEY_CHECKS = 1");
  await conn.end();
  await deleteAllBookVector()
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
      vector_id VARCHAR(255),
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
      status ENUM('Pending', 'Approved','Rejected','Ban') NOT NULL DEFAULT 'Pending',
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
      status ENUM('Pending', 'Canaled', 'Issued','Rejected','Returned', 'Fine') NOT NULL DEFAULT 'Pending',
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

const initIssueRecordFinesDB = async () => {
  const conn = await db();
  await conn.execute(`
    CREATE TABLE issue_record_fines (
      fine_id INT AUTO_INCREMENT PRIMARY KEY,
      issue_id INT NOT NULL,
      admin_id INT,
      fine_amount DECIMAL(10, 2) NOT NULL,
      fine_reason VARCHAR(255) DEFAULT 'No reason specified',
      fine_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (issue_id) REFERENCES issue_records(issue_id) ON DELETE CASCADE,
      FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE SET NULL
    )
  `);
  await conn.end();
  console.log("Issue Record Fines table initialized.");
};

const initIssueRecordFinePaymentsDB = async () => {
  const conn = await db();
  await conn.execute(`
    CREATE TABLE issue_record_fine_payments (
      payment_id INT AUTO_INCREMENT PRIMARY KEY,
      fine_id INT NOT NULL,
      admin_id INT,
      amount_paid DECIMAL(10, 2) NOT NULL,
      payment_method ENUM('Cash', 'bKash', 'Nagad', 'Rocket', 'Bank_Transfer') NOT NULL DEFAULT 'Cash',
      transaction_id VARCHAR(100) DEFAULT NULL,
      /* Updated to an ENUM structure with an explicit default string */
      status ENUM('Pending', 'Completed', 'Failed', 'Refunded') NOT NULL DEFAULT 'Completed',
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fine_id) REFERENCES issue_record_fines(fine_id) ON DELETE CASCADE,
      FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE SET NULL
    )
  `);
  await conn.end();
  console.log("Issue Record Fine Payments table initialized.");
};

const init = async () => {

  if (process.env.REMOVE_DB) {
    await dropAllTables();
  }
  await initStudentDB();
  await initBooksDB();
  await initAdminsDB();
  await initIssueRecordsDB();
  await initIssueRecordFinesDB();
  await initIssueRecordFinePaymentsDB();
};

init();
