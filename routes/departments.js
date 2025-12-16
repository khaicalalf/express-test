router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Departments");

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
