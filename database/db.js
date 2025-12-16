const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Connected to SQL Server (SQL Auth)");
    return pool;
  })
  .catch((err) => {
    console.error("❌ SQL Server Connection Failed:", err);
  });

module.exports = {
  sql,
  poolPromise,
};
