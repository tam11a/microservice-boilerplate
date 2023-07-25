// config the .env file
require("dotenv").config();

const default_config = {
	port: 4011,
};

module.exports = {
	port: process.env.PORT || default_config.port,
	database: {
		dialect: "mysql",
		host: "103.81.199.185",
		user: "root",
		password: "12riothomas",
		database: "test001",
	},
};
