import PermissionRepository from "./permission.repositories";

const permission_router = require("express").Router();

const repository = new PermissionRepository();

permission_router.post("/", [repository.create]);
permission_router.get("/", [repository.find]);
permission_router.get("/:id", [repository.findById]);
permission_router.patch("/:id", [repository.update]);
permission_router.delete("/:id", [repository.delete]);

module.exports = permission_router;
