import mysql from 'mysql2/promise'

export const db = async () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'book_hive',
    password: '12345',
    database: 'library_management',
  })
}
