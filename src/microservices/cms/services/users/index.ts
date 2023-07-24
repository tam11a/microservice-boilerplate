const user_router = require("express").Router();
const UserSchema = require("./users.schema");
const schema = new UserSchema();

user_router.get("/", schema.find_users());

module.exports = user_router;
