const user_router = require("express").Router();
import UserSchema from "./users.schema";

const schema = new UserSchema();

user_router.get("/", schema.find_users());
user_router.delete("/:id", schema.find_users());

module.exports = user_router;
