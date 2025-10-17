import mysql from "mysql2";

// Direct MySQL connection (no .env)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // your MySQL username
  password: "",         // your MySQL password (if any)
  database: "e_clearance", // your database name
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

export default db;
