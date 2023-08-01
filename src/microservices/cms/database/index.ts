import { Sequelize } from "sequelize-typescript";
const db_config = require("../config").database;
const path = require("path");

class Database {
	public sequelize: Sequelize;
	public models: any;
	constructor() {
		this.sequelize = new Sequelize({
			...db_config,
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
			logging: false,
			models: [path.join(__dirname, "..", "services", "**/*.model.js")],
			modelMatch: (filename, member) => {
				console.log(filename);
				return (
					filename.substring(0, filename.indexOf(".model")) ===
					member.toLowerCase()
				);
			},
		});

		this.models = this.sequelize.models;
	}

	public async init() {
		this.sequelize
			.sync()
			.then(() => {
				console.log("Synced database.");
			})
			.catch((err: any) => {
				console.log("Failed to sync database: " + err.message);
			});
	}

	public get_model(modelName: string) {
		return this.sequelize.model(modelName);
	}
}

const DB = new Database();
export default DB;
