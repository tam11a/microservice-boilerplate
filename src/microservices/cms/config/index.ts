// config the .env file
require("dotenv").config();

const default_config = {
	port: 4011,
};

module.exports = {
	port: process.env.PORT || default_config.port,
	database: {
		dialect: "mysql",
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	},
};
