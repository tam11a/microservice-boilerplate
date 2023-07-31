import AccessPointRepository from "./accesspoint.repositories";

const point_router = require("express").Router();

const repository = new AccessPointRepository();

point_router.post("/", [repository.create]);
point_router.get("/", [repository.find]);
point_router.get("/:id", [repository.findById]);
point_router.patch("/:id", [repository.update]);
point_router.delete("/:id", [repository.delete]);

module.exports = point_router;
