import App from "./app";
const port = require("./config").port;

new App(
	port,
	process.env.npm_package_name,
	process.env.npm_package_version
).listen();
