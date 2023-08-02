const session_router = require("express").Router();
import SessionRepository from "./session.repositories";

const repository = new SessionRepository();

session_router.get("/", [repository.find]);
session_router.get("/:id", [repository.findById]);
session_router.put("/:id", [repository.logout]);

module.exports = session_router;
