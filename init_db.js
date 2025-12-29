const mysql = require('mysql2/promise');


const db = async () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'book_hive',
    password: '12345',
    database: 'library_management',
  })
}
const initUserDB = async () => {
  try {
    const conn = await db();
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
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
    console.error("Error initializing database:", error);
  }
};

initUserDB();
