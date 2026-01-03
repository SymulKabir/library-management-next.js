const mysql = require('mysql2/promise');

const db = async () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'book_hive',
    password: '12345',
    database: 'library_management',
  });
};

const initUserDB = async () => {
  try {
    const conn = await db();
    await conn.execute(`DROP TABLE IF EXISTS users`);
    await conn.execute(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    await conn.end();
    console.log("User database initialized successfully.");
  } catch (error) {
    console.error("Error initializing User database:", error);
  }
};

const initBooksDB = async () => {
  try {
    const conn = await db();
    await conn.execute(`DROP TABLE IF EXISTS books`);
    await conn.execute(`
      CREATE TABLE books (
        id VARCHAR(100) NOT NULL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(150) NOT NULL,
        isbn VARCHAR(50) NOT NULL UNIQUE,
        category VARCHAR(100) NOT NULL,
        image_url VARCHAR(255),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    await conn.end();
    console.log("Books database initialized successfully.");
  } catch (error) {
    console.error("Error initializing books database:", error);
  }
};

initUserDB();
initBooksDB();
