const employee_router = require("express").Router();
import EmployeeRepository from "./employee.repositories";

const repository = new EmployeeRepository();

employee_router.post("/", [repository.create]);
employee_router.get("/", [repository.find]);
employee_router.get("/:id", [repository.findById]);
employee_router.patch("/:id", [repository.update]);
employee_router.patch("/reset-password/:id", [repository.resetPassword]);
employee_router.put("/:id", [repository.activeInactive]);

module.exports = employee_router;
