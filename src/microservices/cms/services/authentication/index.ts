const authentication_router = require("express").Router();
import AuthenticationRepository from "./authentication.repositories";

const repository = new AuthenticationRepository();

authentication_router.post("/register", [repository.register]);
authentication_router.post("/login", [repository.login]);
authentication_router.get("/validate", [repository.validate]);
authentication_router.put("/logout", [repository.signout]);
authentication_router.patch("/reset-password/:id", [repository.resetPassword]);

module.exports = authentication_router;
