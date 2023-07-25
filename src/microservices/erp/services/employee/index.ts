const employee_router = require("express").Router();
import EmployeeRepository from "./employee.repositories";

const repository = new EmployeeRepository();

employee_router.post("/");
employee_router.get("/");
employee_router.patch("/:id");
employee_router.get("/:id");
employee_router.delete("/:id");


module.exports = employee_router;


