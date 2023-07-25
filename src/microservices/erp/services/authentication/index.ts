const authentication_router = require("express").Router();
import AuthenticationRepository from "./authentication.repositories";

const repository = new AuthenticationRepository();

authentication_router.post("/login", [repository.login]);
authentication_router.get("/validate", [repository.validate]);

module.exports = authentication_router;
