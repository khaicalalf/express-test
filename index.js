require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// API Routes
const employeesRouter = require("./routes/employees");
const departmentsRouter = require("./routes/departments");

app.use("/api/employees", employeesRouter);
app.use("/api/departments", departmentsRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Available routes:");
  console.log("  GET  /");
  console.log("  GET  /api/employees");
  console.log("  GET  /api/departments");
});
