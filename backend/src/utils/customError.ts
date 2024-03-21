export class CustomError extends Error {
	statusCode: number;
	error: string;

	constructor(statusCode: number, message: string, name: string) {
		super(message);
		this.statusCode = statusCode;
		this.error = name;
	}
}
