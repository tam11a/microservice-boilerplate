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
    console.info(`[${this.name}.Service]: Initialized`);
  }
}

new Service(
  "UserAuthentication",
  "/auth",
  require("./authentication")
).connect();
new Service("Employee", "/employee", require("./employee")).connect();
// new Service("Permission", "/permission", require("./permission")).connect();
new Service("Role", "/role", require("./role")).connect();
new Service("Accesspoint", "/accesspoint", require("./accesspoint")).connect();

module.exports = router;
