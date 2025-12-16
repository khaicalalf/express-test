const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");
const authApiKey = require("../middlewares/apiKey");

router.get("/", authApiKey, controller.getAllEmployees);
router.get("/:id", authApiKey, controller.getEmployeeById);
router.post("/", authApiKey, controller.createEmployee);
router.put("/:id", authApiKey, controller.updateEmployee);
router.delete("/:id", authApiKey, controller.deleteEmployee);

module.exports = router;
