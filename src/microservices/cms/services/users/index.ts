const user_router = require("express").Router();
import UserRepository from "./users.repositories";

const repository = new UserRepository();

user_router.get("/", [repository.find]);
user_router.delete("/:id", [repository.delete]);

module.exports = user_router;
