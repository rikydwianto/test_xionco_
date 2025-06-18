const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bmc_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal konek ke database:", err.message);
    process.exit(1); // hentikan app jika gagal konek DB
  }
  console.log("✅ Terhubung ke database MySQL");
});

module.exports = db;
