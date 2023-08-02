const user_router = require("express").Router();
import UserRepository from "./users.repositories";

const repository = new UserRepository();

user_router.get("/", [repository.find]);
user_router.get("/:id", [repository.findById]);
user_router.patch("/:id", [repository.update]);
user_router.patch("/reset-password/:id", [repository.resetPassword]);
user_router.put("/:id", [repository.activeInactive]);

module.exports = user_router;
