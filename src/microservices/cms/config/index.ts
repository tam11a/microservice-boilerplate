// config the .env file
require("dotenv").config();

const default_config = {
	port: 4011,
};

module.exports = {
	port: process.env.PORT || default_config.port,
	database: {
		dialect: "sqlite",
		storage: "../storage/database.sqlite",
	},
};
