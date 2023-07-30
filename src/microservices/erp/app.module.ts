import express, { Express } from "express";

class App {
	public app: Express;
	public port: number;
	public npm_package_name?: string;
	public npm_package_version?: string;

	constructor(
		port: number,
		npm_package_name?: string,
		npm_package_version?: string
	) {
		this.app = express();
		this.port = port;
		this.npm_package_name = npm_package_name;
		this.npm_package_version = npm_package_version;

		this.initializePreMiddlewares();
		this.initializeService();
		this.initializePostMiddlewares();
	}

	private initializePreMiddlewares() {
		this.app.use(express.json());
		this.app.use(
			require("cors")({
				origin: "*",
				methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
				preflightContinue: false,
				optionsSuccessStatus: 204,
			})
		);
	}

	private initializePostMiddlewares() {
		this.app.use(require("./middleware/Error"));
	}

	private initializeService() {
		this.app.use("/", require("./services"));
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(
				`[${this.npm_package_name}@${this.npm_package_version}]: running at PORT:${this.port}`
			);
		});
	}
}

export default App;
