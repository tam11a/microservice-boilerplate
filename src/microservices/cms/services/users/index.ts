const user_router = require("express").Router();
import UserRepository from "./users.repositories";

const repository = new UserRepository();

user_router.get("/", [repository.find]);
user_router.get("/:id", [repository.findById]);
user_router.patch("/:id", [repository.update]);

module.exports = user_router;
