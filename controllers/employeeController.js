const { poolPromise, sql } = require("../database/db");

// GET all employees
exports.getAllEmployees = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ message: "Page & limit harus lebih dari 0" });
    }

    const offset = (page - 1) * limit;
    const pool = await poolPromise;

    const countResult = await pool
      .request()
      .input("search", sql.VarChar, `%${search}%`).query(`
        SELECT COUNT(*) AS total
        FROM Employees e
        WHERE e.name LIKE @search
      `);

    const totalData = countResult.recordset[0].total;

    const dataResult = await pool
      .request()
      .input("search", sql.VarChar, `%${search}%`)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit).query(`
        SELECT 
          e.id,
          e.name,
          e.position,
          e.salary,
          e.DepartmentID,
          d.DepartmentName
        FROM Employees e
        JOIN Departments d ON e.DepartmentID = d.DepartmentID
        WHERE e.name LIKE @search
        ORDER BY e.id
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);

    res.json({
      page,
      limit,
      totalData,
      data: dataResult.recordset,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("id", sql.Int, req.params.id)
      .query(`SELECT 
          e.id,
          e.name,
          e.position,
          e.salary,
          e.DepartmentID,
          d.DepartmentName
        FROM Employees e
        JOIN Departments d ON e.DepartmentID = d.DepartmentID WHERE e.id = @id`);

    res.json(result.recordset[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new employee
exports.createEmployee = async (req, res) => {
  const { name, position, salary, DepartmentID } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      message: "Name tidak boleh kosong",
    });
  }

  if (!salary || salary <= 0) {
    return res.status(400).json({
      message: "Salary harus lebih dari 0",
    });
  }

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("position", sql.VarChar, position || "")
      .input("salary", sql.Int, salary)
      .input("DepartmentID", sql.Int, DepartmentID)
      .query(
        "INSERT INTO Employees (name, position, salary, DepartmentID) VALUES (@name, @position, @salary, @DepartmentID)"
      );

    res.status(201).json({ message: "Employee created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update employee
exports.updateEmployee = async (req, res) => {
  const { name, position, salary, DepartmentID } = req.body;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("name", sql.VarChar, name)
      .input("position", sql.VarChar, position)
      .input("salary", sql.Int, salary)
      .input("DepartmentID", sql.Int, DepartmentID)
      .query(
        `UPDATE Employees 
         SET name=@name, position=@position, salary=@salary, DepartmentID=@DepartmentID 
         WHERE id=@id`
      );

    res.json({ message: "Employee updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE employee
exports.deleteEmployee = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("DELETE FROM Employees WHERE id=@id");

    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
