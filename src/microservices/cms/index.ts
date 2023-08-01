import App from "./app.module";
import Database from "./database";
const port = require("./config").port;

Database.init();

new App(
	port,
	process.env.npm_package_name,
	process.env.npm_package_version
).listen();
