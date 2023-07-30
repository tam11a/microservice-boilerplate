const employee_router = require("express").Router();
import EmployeeRepository from "./employee.repositories";

const repository = new EmployeeRepository();

employee_router.post("/", [repository.create]);
employee_router.get("/", [repository.find]);
employee_router.get("/:id", [repository.findById]);
employee_router.patch("/:id", [repository.update]);

module.exports = employee_router;


