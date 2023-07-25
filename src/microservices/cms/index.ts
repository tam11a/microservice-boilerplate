import App from "./app.module";
import Database from "./database";
const port = require("./config").port;

const db = new Database();
db.init();

new App(
	port,
	process.env.npm_package_name,
	process.env.npm_package_version
).listen();
