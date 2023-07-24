const router = require("express").Router();

class Service {
	public name: string;
	public route: string;
	public path: any;

	constructor(name: string, route: string, path: any) {
		this.name = name;
		this.route = route;
		this.path = path;
	}

	public connect() {
		router.use(this.route, this.path);
		console.info(`[Service:${this.name}]: Connected to Route Successfully`);
	}
}

new Service("Users", "/users", require("./users")).connect();
// new Service("Authentication", "/auth", require("./authentication")).connect();

module.exports = router;
