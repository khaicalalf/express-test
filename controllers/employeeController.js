const { poolPromise, sql } = require("../db");

// GET all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Employees");
    res.json(result.recordset);
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

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("position", sql.VarChar, position)
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
