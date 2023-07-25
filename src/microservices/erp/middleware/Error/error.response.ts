class ErrorResponse extends Error {
	public statusCode: any;
	constructor(message: string, statusCode: any) {
		super(message);
		this.statusCode = statusCode;
	}
}

module.exports = ErrorResponse;
