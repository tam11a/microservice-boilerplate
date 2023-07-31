import RoleRepository from "./role.repositories";
const role_router = require("express").Router();

const repository = new RoleRepository();

role_router.post("/", [repository.create]);
role_router.get("/", [repository.find]);
role_router.get("/:id", [repository.findById] );
role_router.patch("/:id", [repository.update] );
role_router.delete("/:id", [repository.delete] );

module.exports = role_router;
