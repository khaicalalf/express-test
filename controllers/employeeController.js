const { poolPromise, sql } = require("../db");

// GET all employees
exports.getAllEmployees = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Page dan limit harus lebih dari 0",
      });
    }

    const offset = (page - 1) * limit;

    const pool = await poolPromise;

    // TOTAL DATA
    const countResult = await pool
      .request()
      .input("search", sql.VarChar, `%${search}%`).query(`
        SELECT COUNT(*) AS total
        FROM Employees
        WHERE name LIKE @search
      `);

    const totalData = countResult.recordset[0].total;
    const totalPages = Math.ceil(totalData / limit);

    // DATA PAGINATION
    const dataResult = await pool
      .request()
      .input("search", sql.VarChar, `%${search}%`)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit).query(`
        SELECT *
        FROM Employees
        WHERE name LIKE @search
        ORDER BY id
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);

    res.json({
      page,
      limit,
      totalData,
      totalPages,
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
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Employees WHERE id = @id");

    res.json(result.recordset[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new employee
exports.createEmployee = async (req, res) => {
  const { name, position, salary } = req.body;

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
      .query(
        "INSERT INTO Employees (name, position, salary) VALUES (@name, @position, @salary)"
      );

    res.status(201).json({ message: "Employee created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update employee
exports.updateEmployee = async (req, res) => {
  const { name, position, salary } = req.body;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("name", sql.VarChar, name)
      .input("position", sql.VarChar, position)
      .input("salary", sql.Int, salary)
      .query(
        `UPDATE Employees 
         SET name=@name, position=@position, salary=@salary 
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
